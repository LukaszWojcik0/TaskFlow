"use client";
import { useTasks, Task } from "./useTasks";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

export function ToDoList()
{
    
    const { tasks, addTask } = useTasks();
    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

    const handleAddTask = () => {
        const newTask: Task = {
            id: Date.now(),
            title: "task", 
            description: "some description", 
            ddl: 1233321, 
            completed: false
        };
        
        addTask(newTask);
        setLocalTasks([...localTasks, newTask])  
    }
    

    
    return (
        <>
        <Card className="h-screen w-full" >
            <CardTitle className="p-4 flex">
                Your tasks:
            </CardTitle>
            
        
            <Dialog>
                <DialogTrigger>Add Task</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Name your task:</DialogTitle>
                    </DialogHeader>
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
    )
}