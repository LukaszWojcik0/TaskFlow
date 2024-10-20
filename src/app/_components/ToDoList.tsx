"use client";

import type { ToDoListProps } from "@/types/components";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { v4 as uuidv4 } from "uuid";

import type { Task } from "./useTasks";
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
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useTasks } from "./useTasks";

export function ToDoList({
  loggedIn,
  userId,
  tasks,
  addEventToCalendar,
  addTask,
  removeTask,
}: ToDoListProps) {
  const { updateTask } = useTasks(loggedIn);

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDecription, setTaskDecription] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);

  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputDescriptionRef = useRef<HTMLInputElement>(null);

  const tasksToDisplay = tasks.filter((task) => !task.movedToCalendar);

  useEffect(() => {
    if (!loggedIn) {
      const storedTasks = localStorage.getItem("tasks");
      const initialTasks = storedTasks ? JSON.parse(storedTasks) : [];
      setLocalTasks(initialTasks);
    } else {
      localStorage.removeItem("tasks");
      setLocalTasks([]);
    }
  }, [loggedIn]);

  const updateLocalStorage = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const handleAddTask = (taskTitle: string, taskDescription: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title: taskTitle,
      description: taskDescription,
      ddl: 12222,
      completed: false,
      userId: userId ?? -1,
      movedToCalendar: false,
      startTime: undefined,
      date: undefined,
      duration: undefined,
    };
    if (loggedIn) {
      addTask(newTask);
    } else {
      const updatedTasks = [...localTasks, newTask];
      updateLocalStorage(updatedTasks);
      setLocalTasks(updatedTasks);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (loggedIn) {
      removeTask(taskId);
    } else {
      const oldTasks = localStorage.getItem("tasks");
      if (oldTasks) {
        const parsedTasks = JSON.parse(oldTasks);
        if (Array.isArray(parsedTasks)) {
          const updatedTasks = parsedTasks.filter((task) => task.id !== taskId);
          updateLocalStorage(updatedTasks);
          setLocalTasks(updatedTasks);
        }
      }
    }
  };

  const handleAddToCalendar = () => {
    if (selectedTask && date && startTime) {
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const maxDuration = (24 - startHours) * 60 - startMinutes;
      const adjustedDuration = Math.min(duration, maxDuration);
      addEventToCalendar(selectedTask, date, startTime, adjustedDuration);
      setSelectedTask(null);
    }
  };

  const handleTaskChanges = (taskId: string) => {
    if (selectedTask) {
      const updatedTask = {
        ...selectedTask,
        title: taskTitle || selectedTask.title,
        description: taskDecription || selectedTask.description,
      };

      if (loggedIn) {
        updateTask(updatedTask);
      } else {
        const updatedTasks = localTasks.map((task) =>
          task.id === taskId ? updatedTask : task,
        );
        setLocalTasks(updatedTasks);
        updateLocalStorage(updatedTasks);
      }
      setSelectedTask(null);
    }
  };

  return (
    <Card className="h-screen w-full overflow-hidden">
      <CardTitle className="flex p-4">Your tasks:</CardTitle>
      <Dialog>
        <div className="border-b p-3 pt-0">
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
                const taskTitle = inputNameRef.current?.value ?? "";
                const taskDescription =
                  inputDescriptionRef.current?.value ?? "";
                handleAddTask(taskTitle, taskDescription);
              }}
            >
              Done
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ScrollArea>
        <ul>
          {(loggedIn ? tasksToDisplay : localTasks).map((task) => (
            <li key={task.id} className="flex border-b p-4">
              <div className="w-10/12">
                <div className="font-bold">{task.title}</div>
                <div>{task.description}</div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Image
                    src="assets/edit-2-svgrepo-com.svg"
                    width={25}
                    height={25}
                    alt="edit-img"
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setSelectedTask(task);
                      console.log(task);
                    }}
                  ></Image>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Edit &quot;{selectedTask?.title}&quot;
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Label htmlFor="taskTitle">Change title:</Label>
                    <Input
                      type="text"
                      id="taskTitle"
                      placeholder={task.title}
                      onChange={(e) => setTaskTitle(e.target.value)}
                    />
                    <Label htmlFor="taskDecription">Change description:</Label>
                    <Input
                      type="text"
                      id="taskDecription"
                      placeholder={task.description}
                      onChange={(e) => setTaskDecription(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose
                      onClick={() => {
                        if (selectedTask) {
                          handleTaskChanges(selectedTask.id);
                        }
                      }}
                    >
                      Save changes
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
              {/* adding to calendar */}
              <Dialog>
                <DialogTrigger asChild>
                  <Image
                    src="assets/calendar-add-svgrepo-com.svg"
                    width={30}
                    height={30}
                    alt="add-calendar-img"
                    className="hover:cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  ></Image>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Add &quot;{selectedTask?.title}&quot; to Calendar
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Label htmlFor="date">Select Date:</Label>
                    <Input
                      type="date"
                      id="date"
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <Label htmlFor="startTime">Select Start Time:</Label>
                    <Input
                      type="time"
                      id="startTime"
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                    <Label htmlFor="duration">Duration (minutes):</Label>
                    <Input
                      type="number"
                      id="duration"
                      value={duration}
                      onChange={(e) => {
                        const [startHours, startMinutes] = startTime
                          .split(":")
                          .map(Number);
                        const maxDuration =
                          (24 - startHours) * 60 - startMinutes;
                        const newDuration = Math.min(
                          Number(e.target.value),
                          maxDuration,
                        );
                        setDuration(newDuration);
                      }}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose onClick={handleAddToCalendar}>
                      Add to Calendar
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </Card>
  );
}
