import { formatDate } from "./dateUtils";
import type { Task } from "../_components/useTasks";

interface EventPosition {
    index: number;
    totalOverlaps: number;
  }

const addDays = (date: string, days: number): string => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return formatDate(newDate, "yyyy-MM-dd");
  };

const calculateEventSegments = (
    event: Task,
    weekDates: Date[],
  ): Array<{
    date: string;
    startTime: string;
    duration: number;
    isStart: boolean;
    isEnd: boolean;
  }> => {
    if (!event.date || !event.startTime || !event.duration) return [];
  
    const segments: Array<{
      date: string;
      startTime: string;
      duration: number;
      isStart: boolean;
      isEnd: boolean;
    }> = [];
  
    const [startHours, startMinutes] = event.startTime.split(":").map(Number);
    const totalMinutes = event.duration;
    let remainingMinutes = totalMinutes;
    let currentDate = event.date;
    const currentStartTime = event.startTime;
    let daysProcessed = 0;
  
    while (remainingMinutes > 0) {
      const minutesUntilMidnight = (24 - startHours) * 60 - startMinutes;
      const minutesForThisDay = Math.min(
        remainingMinutes,
        daysProcessed === 0 ? minutesUntilMidnight : 24 * 60,
      );
      if (
        weekDates.some((date) => formatDate(date, "yyyy-MM-dd") === currentDate)
      ) {
        segments.push({
          date: currentDate,
          startTime: daysProcessed === 0 ? currentStartTime : "00:00",
          duration: minutesForThisDay,
          isStart: daysProcessed === 0,
          isEnd: remainingMinutes <= minutesForThisDay,
        });
      }
      remainingMinutes -= minutesForThisDay;
      currentDate = addDays(currentDate, 1);
      daysProcessed++;
    }
  
    return segments;
  };

  const calculateOverlappingEvents = (
    event: Task,
    allEvents: Task[],
  ): EventPosition => {
    if (!event.date || !event.startTime || !event.duration) {
      return { index: 0, totalOverlaps: 1 };
    }

    const eventStart = new Date(event.date);
    const [eventHours, eventMinutes] = event.startTime.split(":").map(Number);
    eventStart.setHours(eventHours, eventMinutes, 0, 0);
    const eventEnd = getEndDateTime(
      event.date,
      event.startTime,
      event.duration,
    );

    const overlappingEvents = [];
    let maxConcurrent = 1;
    let position = 0;

    allEvents.forEach((otherEvent) => {
      if (
        !otherEvent.date ||
        !otherEvent.startTime ||
        !otherEvent.duration ||
        otherEvent === event
      ) {
        return;
      }

      const otherStart = new Date(otherEvent.date);
      const [otherHours, otherMinutes] = otherEvent.startTime
        .split(":")
        .map(Number);
      otherStart.setHours(otherHours, otherMinutes, 0, 0);
      const otherEnd = getEndDateTime(
        otherEvent.date,
        otherEvent.startTime,
        otherEvent.duration,
      );

      if (doDateRangesOverlap(eventStart, eventEnd, otherStart, otherEnd)) {
        overlappingEvents.push(otherEvent);

        if (
          otherStart < eventStart ||
          (otherStart.getTime() === eventStart.getTime() &&
            otherEvent.id < event.id)
        ) {
          position++;
        }
      }
    });

    maxConcurrent = overlappingEvents.length + 1;

    return {
      index: position,
      totalOverlaps: maxConcurrent,
    };
  };

  const getEndDateTime = (
    date: string,
    startTime: string,
    durationMinutes: number,
  ) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);

    return endDateTime;
  };

  const doDateRangesOverlap = (
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date,
  ) => {
    return start1 <= end2 && start2 <= end1;
  };

  const formatDuration = (durationMinutes: number): string => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hours`;
    } else {
      return `${hours} hours ${minutes} minutes`;
    }
  };

  const shortenFormatDuration = (durationMinutes: number): string => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} h`;
    } else {
      return `${hours} h ${minutes} min`;
    }
  };

  const calculateEndTime = (
    startTime: string,
    durationMinutes: number,
  ): string => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const totalMinutes = startTotalMinutes + durationMinutes;
    const remainderMinutes = totalMinutes % (24 * 60);
    const endHours = Math.floor(remainderMinutes / 60);
    const endMinutes = remainderMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  export { calculateEventSegments, calculateOverlappingEvents, formatDuration, shortenFormatDuration, calculateEndTime, isToday };