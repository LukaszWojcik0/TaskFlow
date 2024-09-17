"use client";

import Calendar from "@/app/_components/Calendar";
import { ToDoList } from "@/app/_components/ToDoList";
import Navbar from "./_components/Navbar";
import { WelcomePage } from "./_components/WelcomePage";

function Home() {
  return (
    <div>
      <Navbar />
      {/* <WelcomePage /> */}
      <div className="flex">
        <div className="w-1/4">
          <ToDoList />
        </div>
        <div className="w-3/4">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default Home;
