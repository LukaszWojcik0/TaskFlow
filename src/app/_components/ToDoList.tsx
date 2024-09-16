"use client";
import { useTasks, Task } from "./useTasks";
import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

export function ToDoList() {
  const { tasks, addTask } = useTasks();

  const storedTasks =
    typeof window !== "undefined" ? localStorage.getItem("tasks") : null;
  const initialTasks = storedTasks ? JSON.parse(storedTasks) : [];

  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);

  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputDescriptionRef = useRef<HTMLInputElement>(null);

  const updateLocalStorage = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const handleAddTask = (taskTitle: string, taskDescription: string) => {
    const newTask: Task = {
      id: Date.now(),
      title: taskTitle,
      description: taskDescription,
      ddl: 12222,
      completed: false,
    };

    const updatedTasks = [...localTasks, newTask];
    updateLocalStorage(updatedTasks);

    setLocalTasks(updatedTasks);
    addTask(newTask);
  };

  return (
    <>
      <Card className="h-screen w-full">
        <CardTitle className="p-4 flex">Your tasks:</CardTitle>

        <Dialog>
          <DialogTrigger className="px-3">
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Name your task:</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="">Name:</Label>
              <Input
                ref={inputNameRef}
                id="taskName"
                className="col-span-2"
              ></Input>
              <Label htmlFor="">Description:</Label>
              <Input
                ref={inputDescriptionRef}
                id="taskDescription"
                className="col-span-2"
              ></Input>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button
                  onClick={() => {
                    const taskTitle = inputNameRef.current?.value || "";
                    const taskDescription =
                      inputDescriptionRef.current?.value || "";
                    handleAddTask(taskTitle, taskDescription);
                  }}
                >
                  Done
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ul>
          {localTasks.map((task) => (
            <li key={task.id} className="p-4 border-b">
              <div className="font-bold">{task.title}</div>
              <div>{task.description}</div>
              {/* <img></img> later to be "delete task" icon */}
              {/* <img></img> later to be "add to calendar" icon */}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
