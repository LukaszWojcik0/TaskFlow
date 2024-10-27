"use client";

import React, { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Pencil } from "lucide-react";

import type { Task } from "./useTasks";
import {
  calculateEndTime,
  calculateEventSegments,
  calculateOverlappingEvents,
  formatDuration,
  isToday,
  shortenFormatDuration,
} from "@/app/_utils/calendarUtils";
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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activePopoverEvent, setActivePopoverEvent] = useState<string | null>(
    null,
  );

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
      const updatedTask = {
        ...selectedTask,
        title: editedTitle,
        date: editedDate,
        startTime: editedTime,
        duration: editedDuration,
      };
      updateTask(updatedTask);
      setSelectedTask(null);
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

  const handleOpenEditDialog = (task: Task) => {
    handleTaskEdit(task);
    setIsEditDialogOpen(true);
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

            <div className="grid flex-1 grid-cols-7">
              {days.map((day, index) => (
                <div
                  key={day.toString()}
                  className="relative border-r last:border-r-0"
                >
                  <div
                    className={`sticky top-0 isolate h-16 border-b bg-white p-2 text-center ${isToday(day) ? "font-bold text-blue-400" : "font-semibold"} `}
                    style={{ zIndex: 50 }}
                  >
                    {daysOfWeek[index]}
                    <br />
                    <span
                      className={isToday(day) ? "font-bold text-blue-400" : ""}
                    >
                      {formatDate(day, "d")}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="grid-rows-24 grid">
                      {hours.map((_, i) => (
                        <div key={i} className="relative h-14 border-t" />
                      ))}
                    </div>

                    {events.map((event, eventIndex) => {
                      if (!event.date || !event.startTime || !event.duration)
                        return null;

                      const eventSegments = calculateEventSegments(event, days);
                      const daySegments = eventSegments.filter(
                        (segment) =>
                          segment.date === formatDate(day, "yyyy-MM-dd"),
                      );

                      return daySegments.map((segment, segmentIndex) => {
                        const [hours, minutes] = segment.startTime
                          .split(":")
                          .map(Number);
                        const topPosition = hours * 3.5 + (minutes / 60) * 3.5;
                        const heightInHours = segment.duration / 60;
                        const heightInRem = heightInHours * 3.5;
                        const { index, totalOverlaps } =
                          calculateOverlappingEvents(event, events);
                        const leftOffset = index * 20;
                        const widthPercentage = Math.max(
                          85 - (totalOverlaps - 1) * 20,
                          40,
                        );
                        const eventId = `${event.id}-${segmentIndex}`;
                        const isActive = activePopoverEvent === eventId;

                        return (
                          <React.Fragment key={`${eventIndex}-${segmentIndex}`}>
                            <Popover
                              onOpenChange={(open) => {
                                setActivePopoverEvent(open ? eventId : null);
                              }}
                            >
                              <PopoverTrigger asChild>
                                <div
                                  className={`absolute cursor-pointer overflow-hidden p-1 text-xs transition-all ${segment.isStart ? "rounded-t" : "border-t-0"} ${segment.isEnd ? "rounded-b" : ""} ${segment.isStart ? "bg-blue-400" : "bg-blue-400"} ${index > 0 ? "border border-white" : ""} ${isActive ? "border border-white" : ""}`}
                                  style={{
                                    top: `${topPosition}rem`,
                                    height: `${heightInRem}rem`,
                                    left: `${leftOffset}px`,
                                    width: `${widthPercentage}%`,
                                    zIndex: isActive ? 44 : 40 + index,
                                  }}
                                >
                                  <p className="mb-1 font-bold uppercase text-white">
                                    {event.title}
                                  </p>

                                  {segment.isStart && (
                                    <>
                                      <p className="text-white">
                                        Starts: {event.startTime}
                                      </p>
                                      <p className="text-white">
                                        Duration:{" "}
                                        {shortenFormatDuration(event.duration!)}
                                      </p>
                                    </>
                                  )}

                                  {segment.isEnd && (
                                    <p className="text-white">
                                      {" "}
                                      Ends:{" "}
                                      {calculateEndTime(
                                        event.startTime!,

                                        event.duration!,
                                      )}
                                    </p>
                                  )}
                                </div>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-80"
                                side="right"
                                align="start"
                                sideOffset={5}
                                style={{ zIndex: 46 }}
                              >
                                <div className="mb-2 flex items-center justify-between">
                                  <h3 className="text-lg font-semibold">
                                    {event.title}
                                  </h3>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenEditDialog(event)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Date:</span>{" "}
                                    {event.date
                                      ? formatDate(
                                          new Date(event.date),
                                          "MMMM d, yyyy",
                                        )
                                      : "No Date"}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Start Time:
                                    </span>{" "}
                                    {event.startTime}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      End Time:
                                    </span>{" "}
                                    {calculateEndTime(
                                      event.startTime!,
                                      event.duration!,
                                    )}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Duration:
                                    </span>{" "}
                                    {formatDuration(event.duration!)}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Description:
                                    </span>{" "}
                                    {event.description}
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </React.Fragment>
                        );
                      });
                    })}
                  </div>
                </div>
              ))}
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Label>Title:</Label>
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <Label>Date:</Label>
                    <Input
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                    />
                    <Label>Time:</Label>
                    <Input
                      type="time"
                      value={editedTime}
                      onChange={(e) => setEditedTime(e.target.value)}
                    />
                    <Label>Duration (minutes):</Label>
                    <Input
                      type="number"
                      value={editedDuration}
                      onChange={(e) =>
                        setEditedDuration(Number(e.target.value))
                      }
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      variant="outline"
                      onClick={() => {
                        handleSaveChanges();
                        setIsEditDialogOpen(false);
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleMoveFromCalendar();
                        setIsEditDialogOpen(false);
                      }}
                    >
                      Move to ToDoList
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
