"use client";
import { useTasks, Task } from "./useTasks";
import { useState, useRef, useEffect } from "react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function ToDoList() {
  const { addTask } = useTasks();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks =
      typeof window !== "undefined" ? localStorage.getItem("tasks") : null;
    const initialTasks = storedTasks ? JSON.parse(storedTasks) : [];
    setLocalTasks(initialTasks);
  }, []);

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

  const handleDeleteTask = (taskId: string) => {
    const oldTasks = localStorage.getItem("tasks");
    if (oldTasks) {
      const parsedTasks = JSON.parse(oldTasks);
      const taskNumId = Number(taskId);
      if (Array.isArray(parsedTasks)) {
        const updatedTasks = parsedTasks.filter(
          (task: { id: number }) => task.id !== taskNumId
        );

        updateLocalStorage(updatedTasks);
        setLocalTasks(updatedTasks);
      }
    }
  };

  return (
    <>
      <Card className="h-screen w-full">
        <CardTitle className="p-4 flex">Your tasks:</CardTitle>

        <Dialog>
          <div className="px-3">
            <DialogTrigger asChild>
              <Button className="px-5">Add Task</Button>
            </DialogTrigger>
          </div>

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
              <DialogClose
                onClick={() => {
                  const taskTitle = inputNameRef.current?.value || "";
                  const taskDescription =
                    inputDescriptionRef.current?.value || "";
                  handleAddTask(taskTitle, taskDescription);
                }}
              >
                Done
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ul>
          {localTasks.map((task) => (
            <li key={task.id} className="p-4 border-b flex">
              <div className="w-10/12">
                <div className="font-bold">{task.title}</div>
                <div>{task.description}</div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Image
                    src="assets/delete-svgrepo-com.svg"
                    width={30}
                    height={30}
                    alt="delete-img"
                    className="hover:cursor-pointer"
                  ></Image>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure u want to delete this task?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleDeleteTask(String(task.id));
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Image
                src="assets/calendar-add-svgrepo-com.svg"
                width={30}
                height={30}
                alt="add-calendar-img"
                className="hover:cursor-pointer"
              ></Image>
              {/* <img></img> later to be "add to calendar" icon */}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
