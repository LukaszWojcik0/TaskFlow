import { useState } from 'react'
import { Button } from './lib/utils/ui/button'
import './App.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./lib/utils/ui/card"

import { Calendar } from './components/Calendar.tsx'
import { ToDoList } from './components/ToDoList.tsx'

function App() {
  
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isToDoListVisible, setToDoListVisible] = useState(false);

  const handleClickCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };
  const handleClickToDoList = () => {
    setToDoListVisible(!isToDoListVisible);
  };

  return (
    <>
    
     
  <Card>
  <CardHeader>
    <CardTitle>TaskFlow dev process</CardTitle>
    <CardDescription>Chose ur path</CardDescription>
  </CardHeader>
  <CardContent >
  <Button className='mx-5' variant="outline" onClick={ () => {handleClickCalendar()
    if (isToDoListVisible) {handleClickToDoList()}
   }}>Calendar</Button>
  <Button variant="outline" onClick={ () => {handleClickToDoList()
    if (isCalendarVisible) {handleClickCalendar()}
   }}>ToDo List</Button>
  </CardContent>
</Card>
{isCalendarVisible && <Calendar />}
{isToDoListVisible && <ToDoList />}
    </>
  )
}

export default App
