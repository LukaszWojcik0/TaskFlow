"use client";

import React, { useState } from "react";
import Calendar from "@/app/_components/Calendar";
import { ToDoList } from "@/app/_components/ToDoList";
import Navbar from "./_components/Navbar";
import { useQuery } from "@tanstack/react-query";

async function fetchUser() {
  const response = await fetch("/api/me");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

interface Event {
  title: string;
  startTime: string;
  date: string;
  duration: number;
}

function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const loggedIn = data?.loggedIn ?? false;
  const userId: number | null = loggedIn ? data?.user?.id ?? null : null;
  const [events, setEvents] = useState<Event[]>([]);

  const addEventToCalendar = (
    task: { title: string },
    date: string,
    startTime: string,
    duration: number
  ) => {
    const newEvent: Event = { title: task.title, date, startTime, duration };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

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
            addEventToCalendar={addEventToCalendar}
          />
        </div>
        <div className="w-3/4">
          <Calendar events={events} />
        </div>
      </div>
    </>
  );
}

export default Home;
