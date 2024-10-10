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

interface Event {
  title: string;
  startTime: string;
  date: string;
  duration: number;
}

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

const calculateEndTime = (
  startTime: string,
  durationMinutes: number
): string => {
  const [hours, minutes] = startTime.split(":").map(Number);

  const endTimeMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(endTimeMinutes / 60) % 24;
  const endMinutes = endTimeMinutes % 60;

  return `${endHours.toString().padStart(2, "0")}:${endMinutes
    .toString()
    .padStart(2, "0")}`;
};

const Calendar: React.FC<{ events: Event[] }> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("week");

  const handleNext = () => {
    setCurrentDate(
      viewMode === "month"
        ? getNextMonth(currentDate)
        : getNextWeek(currentDate)
    );
  };

  const handlePrev = () => {
    setCurrentDate(
      viewMode === "month"
        ? getPrevMonth(currentDate)
        : getPrevWeek(currentDate)
    );
  };

  // const toggleViewMode = () => {
  //   setViewMode(viewMode === "month" ? "week" : "month");
  // };

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
          <Button
            onClick={() => setViewMode(viewMode === "month" ? "week" : "month")}
          >
            {viewMode === "month" ? "Switch to Week" : "Switch to Month"}
          </Button>
        </div>
      </div>

      {viewMode === "week" ? (
        <div className="flex h-[calc(24*3.5rem+4rem)]">
          {/* Time labels column */}
          <div className="w-20 relative border-r pt-16">
            <div className="h-full grid grid-rows-24">
              {hours.map((hour) => (
                <div key={hour} className="relative h-14">
                  {/* Adjusted positioning for perfect alignment */}
                  <span className="absolute -top-2 -left-1 text-xs">
                    {hour}
                  </span>
                  <div className="absolute right-0 w-1/2 border-t"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Days columns */}
          <div className="flex-1 grid grid-cols-7">
            {days.map((day, index) => (
              <div key={day.toString()} className="border-r last:border-r-0">
                {/* Header */}
                <div className="text-center font-semibold p-2 border-b h-16 sticky top-0 bg-white z-10">
                  {daysOfWeek[index]}
                  <br />
                  <span className={isToday(day) ? "underline" : ""}>
                    {formatDate(day, "d")}
                  </span>
                </div>

                {/* Hour cells */}
                <div className="relative">
                  <div className="grid grid-rows-24">
                    {hours.map((_, i) => (
                      <div key={i} className="h-14 border-t relative" />
                    ))}
                  </div>

                  {/* Events */}
                  {events
                    .filter(
                      (event) => event.date === formatDate(day, "yyyy-MM-dd")
                    )
                    .map((event, i) => {
                      // Parse hours and minutes from the startTime
                      const [hours, minutes] = event.startTime
                        .split(":")
                        .map(Number);
                      // Calculate top position based on hours and minutes
                      const topPosition = hours * 3.5 + (minutes / 60) * 3.5;
                      const heightInHours = event.duration / 60; // Convert minutes to hours
                      const heightInRem = heightInHours * 3.5; // 3.5rem per hour
                      const endTime = calculateEndTime(
                        event.startTime,
                        event.duration
                      );

                      return (
                        <div
                          key={i}
                          className="absolute bg-blue-400 p-1 rounded text-xs z-20 w-[85%] overflow-hidden "
                          style={{
                            top: `${topPosition}rem`,
                            height: `${heightInRem}rem`,
                          }}
                        >
                          <p className="text-white font-semibold">
                            {event.title}{" "}
                          </p>
                          <p className="text-white">
                            {event.startTime} - {endTime}
                          </p>
                        </div>
                      );
                    })}
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
