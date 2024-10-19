import type { Task } from "@/app/_components/useTasks";

export interface ToDoListProps {
  loggedIn: boolean;
  userId: number | null;
  tasks: Task[];
  addEventToCalendar: (
    task: Task,
    date: string,
    startTime: string,
    duration: number,
  ) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
}
