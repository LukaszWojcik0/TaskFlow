import { useState } from "react";

export interface Task {
  id: number;
  title: string;
  description: string;
  ddl: number;
  completed: boolean;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  return { tasks, addTask };
};


export  const processTask = () => {
  const [tasks, addTask] = useTasks();

  

  
}