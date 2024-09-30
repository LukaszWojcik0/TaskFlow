"use client";

import { useState, useEffect } from "react";
import Calendar from "@/app/_components/Calendar";
import { ToDoList } from "@/app/_components/ToDoList";
import Navbar from "./_components/Navbar";
import { WelcomePage } from "./_components/WelcomePage";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();
        if (data.loggedIn) {
          setLoggedIn(true);
          setUserId(data.user.id);
        } else {
          setLoggedIn(false);
          setUserId(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setLoggedIn(false);
        setUserId(null);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <>
      <Navbar />
      {loggedIn && userId !== null ? (
        <div className="flex">
          <div className="w-1/4 ">
            <ToDoList loggedIn={loggedIn} userId={userId} />
          </div>
          <div className="w-3/4">
            <Calendar />
          </div>
        </div>
      ) : (
        <WelcomePage />
      )}
    </>
  );
}

export default Home;
