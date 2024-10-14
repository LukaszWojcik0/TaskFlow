"use client";

import React from "react";
import Calendar from "@/app/_components/Calendar";
import { ToDoList } from "@/app/_components/ToDoList";
import Navbar from "./_components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { useTasks } from "./_components/useTasks";

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
  const userId: number | null = loggedIn ? data?.user?.id ?? null : null;

  const {
    tasks,
    addTask,
    removeTask,
    updateTask,
    addToCalendar,
    removeFromCalendar,
  } = useTasks(loggedIn);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

  return (
    <>
      <Navbar />

      <div className="flex">
        <div className="w-1/4">
          <ToDoList
            loggedIn={loggedIn}
            userId={userId}
            tasks={tasks}
            addEventToCalendar={addToCalendar}
            addTask={addTask}
            removeTask={removeTask}
          />
        </div>
        <div className="w-3/4">
          <Calendar
            tasks={tasks}
            updateTask={updateTask}
            removeFromCalendar={removeFromCalendar}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
