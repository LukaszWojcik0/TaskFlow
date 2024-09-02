import { Card , CardTitle  } from "@/lib/utils/ui/card";
import {  Task } from "./useTasks";
import {  useTasks } from "./useTasks";
import { Button } from "@/lib/utils/ui/button";

export function ToDoList()
{
    const { tasks, addTask } = useTasks();
    
    const handleAddTask = () => {
        const newTask: Task = {
            id: Date.now(),
            title: "task", 
            description: "some description", 
            ddl: 1233321, 
            completed: false
        };

        addTask(newTask);
        console.log(tasks);
        
    }
    
    // const handleDeleteTask = () => {
        

    //     deleteTask(newTask);
    //     console.log(tasks);
        
    // }

    return (
        <>
        <Card className="h-screen w-2/5" >
            <CardTitle className="p-4">
                Your tasks:
            </CardTitle>
           <Button onClick={handleAddTask} className="mx-3">Add task</Button>
           {/* <Button onClick={handleDeleteTask} >Remove task</Button> */}
           
        </Card>
       
        </>
    )
}