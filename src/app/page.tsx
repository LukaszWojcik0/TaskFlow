"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import Calendar from "@/app/_components/Calendar";
import { ToDoList } from "@/app/_components/ToDoList";

import Navbar from "./_components/Navbar";
import { useTasks } from "./_components/useTasks";

import WelcomePopUp from "./_components/WelcomePopUp";

async function fetchUser() {
  const response = await fetch("/api/me");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const loggedIn = data?.loggedIn ?? false;
  const userId: number | null = loggedIn ? (data?.user?.id ?? null) : null;

  const {
    tasks,
    addTask,
    removeTask,
    updateTask,
    addToCalendar,
    removeFromCalendar,
  } = useTasks(loggedIn);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

  // const welcomeCookie = WelcomePopUp.getCookie()
  // if ()



  return (
    <div className="flex h-screen flex-col overflow-y-hidden">
      <Navbar />
      
      {/* <div className="absolute w-screen h-[calc(100vh-270px)] ">
      <WelcomePopUp/>
      </div>
       */}
      <div className="flex flex-grow">
        <div className="h-full w-1/4">
          <ToDoList
            loggedIn={loggedIn}
            userId={userId}
            tasks={tasks}
            addEventToCalendar={addToCalendar}
            addTask={addTask}
            removeTask={removeTask}
          />
        </div>
        <div className="h-full w-3/4">
          <Calendar
            tasks={tasks}
            updateTask={updateTask}
            removeFromCalendar={removeFromCalendar}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
