"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Task {
  id: string;
  title: string;
  description: string;
  ddl: number;
  completed: boolean;
  userId: number;
  movedToCalendar: boolean;
  startTime?: string;
  date?: string;
  duration?: number;
}

export const useTasks = (loggedIn: boolean) => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", loggedIn],
    queryFn: async () => {
      if (!loggedIn) return [];
      const response = await fetch("/api/tasks", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Error fetching tasks from DB");
      }
      const data = await response.json();
      return data.tasks || [];
    },
    enabled: loggedIn,
    staleTime: 1000 * 60 * 5,
  });

  const saveTasksMutation = useMutation({
    mutationFn: async (updatedTasks: Task[]) => {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tasks: updatedTasks }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const addTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
    saveTasksMutation.mutate(updatedTasks);
  };

  const removeTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task: Task) => task.id !== taskId);
    saveTasksMutation.mutate(updatedTasks);
  };

  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task: Task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    saveTasksMutation.mutate(updatedTasks);
  };

  const getCalendarEvents = () => {
    return tasks.filter((task: Task) => task.movedToCalendar);
  };

  const getToDoTasks = () => {
    return tasks.filter((task: Task) => !task.movedToCalendar);
  };

  const addToCalendar = (
    task: Task,
    date: string,
    startTime: string,
    duration: number,
  ) => {
    const updatedTasks: Task[] = tasks.map((t: Task) =>
      t.id === task.id
        ? { ...t, movedToCalendar: true, date, startTime, duration }
        : t,
    );
    saveTasksMutation.mutate(updatedTasks);
  };

  const removeFromCalendar = (task: Task) => {
    const updatedTasks: Task[] = tasks.map((t: Task) =>
      t.id === task.id ? { ...t, movedToCalendar: false } : t,
    );
    saveTasksMutation.mutate(updatedTasks);
  };

  return {
    tasks,
    isLoading,
    addTask,
    removeTask,
    updateTask,
    getCalendarEvents,
    getToDoTasks,
    addToCalendar,
    removeFromCalendar,
  };
};
