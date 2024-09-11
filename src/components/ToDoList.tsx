import { Task } from "./useTasks";
import { useTasks } from "./useTasks";
import { InputTask } from "./InputTask";
import { useState } from "react";

import { Card , CardTitle  } from "@/lib/utils/ui/card";
import { Button } from "@/lib/utils/ui/button";

export function ToDoList()
{
    
    
    const { tasks, addTask } = useTasks();
    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
    const [showInputTask, setShowInputTask] = useState(false)

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
        <Card className="h-screen w-2/5" >
            <CardTitle className="p-4 flex">
                Your tasks:
            </CardTitle>
            
            {showInputTask && <InputTask />}

           <Button onClick={() => {handleAddTask()}} className="mx-3">Add task</Button>
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