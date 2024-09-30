"use client";
// useTasks.tsx
import { useState, useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  ddl: number;
  completed: boolean;
  userId: number;
}

export const useTasks = (loggedIn: boolean) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  //get tasks from the database on initial load user is logged in
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

  //save tasks into db every time they change
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

  //add task
  const addTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  //remove task
  const removeTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  //update task
  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
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

  return { tasks, addTask, removeTask, updateTask };
};
