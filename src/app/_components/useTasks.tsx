"use client";
import { useState, useEffect } from "react";

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
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (loggedIn) {
      const fetchTasksFromDb = async () => {
        try {
          const response = await fetch("/api/tasks", {
            credentials: "include",
          });
          const data = await response.json();
          setTasks(data.tasks || []);
        } catch (error) {
          console.error("Error fetching tasks from DB:", error);
        }
      };

      fetchTasksFromDb();
    }
  }, [loggedIn]);

  const saveTasks = async (updatedTasks: Task[]) => {
    if (loggedIn) {
      try {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ tasks: updatedTasks }),
        });
      } catch (error) {
        console.error("Error saving tasks to DB:", error);
      }
    }
  };

  const addTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const removeTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, movedToCalendar: true } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getCalendarEvents = () => {
    return tasks.filter((task) => task.movedToCalendar);
  };

  const getToDoTasks = () => {
    return tasks.filter((task) => !task.movedToCalendar);
  };

  const addToCalendar = (
    task: Task,
    date: string,
    startTime: string,
    duration: number
  ) => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id
        ? { ...t, movedToCalendar: true, date, startTime, duration }
        : t
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const removeFromCalendar = (task: Task) => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, movedToCalendar: false } : t
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  //update tasks in localStorage
  useEffect(() => {
    if (!loggedIn) {
      const storedTasks = localStorage.getItem("tasks");
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
      setTasks(parsedTasks);
    }
  }, [loggedIn]);

  return {
    tasks,
    addTask,
    removeTask,
    updateTask,
    getCalendarEvents,
    getToDoTasks,
    addToCalendar,
    removeFromCalendar,
  };
};
