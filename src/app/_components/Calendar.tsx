"use client";

import React, { useState } from "react";
import { Label } from "@radix-ui/react-label";

import type { Task } from "./useTasks";
import {
  daysOfWeek,
  formatDate,
  getMonthDetails,
  getNextMonth,
  getNextWeek,
  getPrevMonth,
  getPrevWeek,
  getWeekDetails,
  hours,
} from "@/app/_utils/dateUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const calculateEndTime = (
  startTime: string,
  durationMinutes: number,
): string => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endTimeMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(endTimeMinutes / 60) % 24;
  const endMinutes = endTimeMinutes % 60;

  return `${endHours.toString().padStart(2, "0")}:${endMinutes
    .toString()
    .padStart(2, "0")}`;
};

const Calendar: React.FC<{
  tasks: Task[];
  updateTask: (task: Task) => void;
  removeFromCalendar: (task: Task) => void;
}> = ({ tasks, updateTask, removeFromCalendar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("week");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDate, setEditedDate] = useState<string>("");
  const [editedTime, setEditedTime] = useState<string>("");
  const [editedDuration, setEditedDuration] = useState<number>(60);

  const events = tasks.filter((task) => task.movedToCalendar);

  const handleNext = () => {
    setCurrentDate(
      viewMode === "month"
        ? getNextMonth(currentDate)
        : getNextWeek(currentDate),
    );
  };

  const handlePrev = () => {
    setCurrentDate(
      viewMode === "month"
        ? getPrevMonth(currentDate)
        : getPrevWeek(currentDate),
    );
  };

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setEditedTitle(task.title);
    setEditedDate(task.date ?? "");
    setEditedTime(task.startTime ?? "00:00");
    setEditedDuration(task.duration ?? 60);
  };

  const handleSaveChanges = () => {
    if (selectedTask) {
      const [startHours, startMinutes] = editedTime.split(":").map(Number);
      const maxDuration = (24 - startHours) * 60 - startMinutes;
      const adjustedDuration = Math.min(editedDuration, maxDuration);

      const updatedTask = {
        ...selectedTask,
        title: editedTitle,
        date: editedDate,
        startTime: editedTime,
        duration: adjustedDuration,
      };
      updateTask(updatedTask);
      setSelectedTask(null);
      setEditedDuration(adjustedDuration);
    }
  };

  const handleMoveFromCalendar = () => {
    if (selectedTask) {
      removeFromCalendar(selectedTask);
      setSelectedTask(null);
    }
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
      <div className="mb-4 flex items-center justify-between">
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
      <div className="h-[calc(100vh-140px)] overflow-y-scroll px-4">
        {viewMode === "week" ? (
          <div className="flex h-[calc(24*3.5rem+4rem)]">
            {/* Time labels column */}
            <div className="relative w-20 border-r pt-16">
              <div className="grid-rows-24 grid h-full">
                {hours.map((hour) => (
                  <div key={hour} className="relative h-14">
                    <span className="absolute -left-1 -top-2 text-xs">
                      {hour}
                    </span>
                    <div className="absolute right-0 w-1/2 border-t"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Days columns */}
            <div className="grid flex-1 grid-cols-7">
              {days.map((day, index) => (
                <div key={day.toString()} className="border-r last:border-r-0">
                  {/* Header */}
                  <div className="sticky top-0 z-10 h-16 border-b bg-white p-2 text-center font-semibold">
                    {daysOfWeek[index]}
                    <br />
                    <span className={isToday(day) ? "underline" : ""}>
                      {formatDate(day, "d")}
                    </span>
                  </div>

                  {/* Hour cells */}
                  <div className="relative">
                    <div className="grid-rows-24 grid">
                      {hours.map((_, i) => (
                        <div key={i} className="relative h-14 border-t" />
                      ))}
                    </div>

                    {/* Events */}
                    {events
                      .filter(
                        (event) => event.date === formatDate(day, "yyyy-MM-dd"),
                      )
                      .map((event, i) => {
                        const [hours, minutes] = (event.startTime ?? "00:00")
                          .split(":")
                          .map(Number);

                        const topPosition = hours * 3.5 + (minutes / 60) * 3.5;
                        const heightInHours = (event.duration ?? 60) / 60;
                        const heightInRem = heightInHours * 3.5;
                        const endTime = calculateEndTime(
                          event.startTime ?? "00:00",
                          event.duration ?? 60,
                        );

                        return (
                          <Dialog key={i}>
                            <DialogTrigger asChild>
                              <div
                                className="absolute z-20 w-[85%] cursor-pointer overflow-hidden rounded bg-blue-400 p-1 text-xs"
                                style={{
                                  top: `${topPosition}rem`,
                                  height: `${heightInRem}rem`,
                                }}
                                onClick={() => handleTaskEdit(event)}
                              >
                                <p className="font-semibold text-white">
                                  {event.title}{" "}
                                </p>
                                <p className="text-white">
                                  {event.startTime} - {endTime}
                                </p>
                              </div>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Task</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <Label>Title:</Label>
                                <Input
                                  value={editedTitle}
                                  onChange={(e) =>
                                    setEditedTitle(e.target.value)
                                  }
                                />
                                <Label>Date:</Label>
                                <Input
                                  type="date"
                                  value={editedDate}
                                  onChange={(e) =>
                                    setEditedDate(e.target.value)
                                  }
                                />
                                <Label>Time:</Label>
                                <Input
                                  type="time"
                                  value={editedTime}
                                  onChange={(e) =>
                                    setEditedTime(e.target.value)
                                  }
                                />
                                <Label>Duration (minutes):</Label>
                                <Input
                                  type="number"
                                  value={editedDuration}
                                  onChange={(e) => {
                                    const [startHours, startMinutes] =
                                      editedTime.split(":").map(Number);
                                    const maxDuration =
                                      (24 - startHours) * 60 - startMinutes;
                                    const newDuration = Math.min(
                                      Number(e.target.value),
                                      maxDuration,
                                    );
                                    setEditedDuration(newDuration);
                                  }}
                                />
                              </div>
                              <DialogFooter>
                                <DialogClose>
                                  <Button
                                    type="submit"
                                    variant="outline"
                                    onClick={handleSaveChanges}
                                  >
                                    Save Changes
                                  </Button>
                                </DialogClose>
                                <DialogClose>
                                  <Button
                                    variant="outline"
                                    onClick={handleMoveFromCalendar}
                                  >
                                    Move to ToDoList
                                  </Button>
                                </DialogClose>
                                <DialogClose>
                                  <Button variant="outline" type="button">
                                    Close
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
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
    </div>
  );
};

export default Calendar;
