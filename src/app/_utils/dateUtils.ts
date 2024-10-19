import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";

export const getMonthDetails = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startWeek = startOfWeek(start, { weekStartsOn: 1 }); // Week starts on Monday
  const endWeek = endOfWeek(end, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startWeek, end: endWeek });

  return days;
};

export const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`,
);

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const getWeekDetails = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Week starts on Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });
  return days;
};

export const formatDate = (date: Date, formatStr: string) =>
  format(date, formatStr);

export const getNextMonth = (date: Date) => addMonths(date, 1);
export const getPrevMonth = (date: Date) => subMonths(date, 1);
export const getNextWeek = (date: Date) => addWeeks(date, 1);
export const getPrevWeek = (date: Date) => subWeeks(date, 1);
