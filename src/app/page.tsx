"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Calendar from "@/app/_components/Calendar";
import { ToDoList } from "@/app/_components/ToDoList";
import Navbar from "./_components/Navbar";

function Home() {
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
      {/* <Card>
        <CardHeader>
          <CardTitle>TaskFlow dev process</CardTitle>
          <CardDescription>Chose ur path</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="mx-5"
            variant="outline"
            onClick={() => {
              handleClickCalendar();
              if (isToDoListVisible) {
                handleClickToDoList();
              }
            }}
          >
            Calendar
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              handleClickToDoList();
              if (isCalendarVisible) {
                handleClickCalendar();
              }
            }}
          >
            ToDo List
          </Button>
        </CardContent>
      </Card> */}
      <Navbar />
      {/* {isCalendarVisible && ( */}
      <div className="flex">
        <div className="w-1/4 ">
          <ToDoList />
        </div>
        <div className="w-3/4">
          <Calendar />
        </div>
      </div>
      {/* )} */}
      {isToDoListVisible && <ToDoList />}
    </>
  );
}

export default Home;
