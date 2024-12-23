import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { jwtVerify } from "jose";

import { Task } from "@/app/_components/useTasks";
import { db } from "@/db/db";
import { tasks } from "@/db/schema";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      return [name, rest.join("=")];
    }),
  );
}

export async function GET(request: Request) {
  const cookies = parseCookies(request.headers.get("cookie"));
  const token = cookies["token"];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userId = payload.id as number;
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    return NextResponse.json({ tasks: userTasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const cookies = parseCookies(request.headers.get("cookie"));
  const token = cookies["token"];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { tasks: userTasks } = await request.json();

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userId = parseInt(payload.id as string, 10);

    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }

    const existingTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    const incomingTaskIds = userTasks.map((task: Task) => task.id);
    const tasksToDelete = existingTasks.filter(
      (existingTask) => !incomingTaskIds.includes(existingTask.id),
    );

    for (const taskToDelete of tasksToDelete) {
      await db
        .delete(tasks)
        .where(and(eq(tasks.id, taskToDelete.id), eq(tasks.userId, userId)));
    }

    for (const task of userTasks) {
      const existingTask = existingTasks.find((t) => t.id === task.id);
      if (existingTask) {
        await db
          .update(tasks)
          .set({
            title: task.title,
            description: task.description,
            ddl: task.ddl,
            completed: task.completed,
            movedToCalendar: task.movedToCalendar,
            startTime: task.startTime ?? null,
            date: task.date ?? null,
            duration: task.duration ?? null,
          })
          .where(and(eq(tasks.id, task.id), eq(tasks.userId, userId)));
      } else {
        await db.insert(tasks).values({
          id: task.id,
          userId: userId,
          title: task.title,
          description: task.description,
          ddl: task.ddl,
          completed: task.completed,
          movedToCalendar: task.movedToCalendar,
          startTime: task.startTime ?? null,
          date: task.date ?? null,
          duration: task.duration ?? null,
        });
      }
    }

    return NextResponse.json(
      { message: "Tasks synchronized successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving tasks:", error);
    return NextResponse.json(
      { message: "Error saving tasks" },
      { status: 500 },
    );
  }
}
