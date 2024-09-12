"use client";
import React, { useState } from "react";
import {
  getMonthDetails,
  getWeekDetails,
  formatDate,
  getNextMonth,
  getPrevMonth,
  getNextWeek,
  getPrevWeek,
} from "@/app/_utils/dateUtils";
import { Button } from "@/components/ui/button";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("week");

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(getNextMonth(currentDate));
    } else {
      setCurrentDate(getNextWeek(currentDate));
    }
  };

  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(getPrevMonth(currentDate));
    } else {
      setCurrentDate(getPrevWeek(currentDate));
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "month" ? "week" : "month");
  };

  const days =
    viewMode === "month"
      ? getMonthDetails(currentDate)
      : getWeekDetails(currentDate);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {formatDate(currentDate, "MMMM yyyy")}
        </h2>
        <div>
          <Button className="mr-2" onClick={handlePrev}>
            Previous
          </Button>
          <Button className="mr-2" onClick={handleNext}>
            Next
          </Button>
          <Button onClick={toggleViewMode}>
            {viewMode === "month" ? "Switch to Week" : "Switch to Month"}
          </Button>
        </div>
      </div>
      {viewMode === "week" ? (
        <div className="flex h-full">
          <div className="w-20 border-r pt-16">
            {hours.map((hour) => (
              <div key={hour} className="h-14 text-xs p-1 relative">
                <p className="absolute -top-2.5 -left-1">{hour}</p>
                <div className="absolute right-0 bottom-0 w-1/2 border-b"></div>
              </div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7">
            {days.map((day, index) => (
              <div key={day.toString()} className="border-r last:border-r-0">
                <div className="text-center font-semibold p-2 border-b h-16">
                  {daysOfWeek[index]}
                  <br />
                  <p className={isToday(day) ? "underline" : ""}>
                    {formatDate(day, "d")}
                  </p>
                </div>
                <div className="h-full overflow-y-auto">
                  {hours.map((_, hourIndex) => (
                    <div key={hourIndex} className="h-14 border-b"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-7">
          {daysOfWeek.map((day) => (
            <div key={day} className="bg-gray-200 p-2 text-center font-bold">
              {day}
            </div>
          ))}
          {days.map((day) => (
            <div key={day.toString()} className="border p-4 text-center">
              <div
                className={`text-lg font-bold ${
                  isToday(day) ? "underline" : ""
                }`}
              >
                {formatDate(day, "d")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
