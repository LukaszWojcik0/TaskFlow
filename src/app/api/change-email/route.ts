import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

import { db } from "@/db/db";
import { users } from "@/db/schema";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();
  const token = request.headers
    .get("cookie")
    ?.split("token=")[1]
    ?.split(";")[0];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    const userId = payload.id as number;

    await db.update(users).set({ email }).where(eq(users.id, userId));

    return NextResponse.json({ message: "Email updated sucesfully" });
  } catch (error) {
    console.error("Token verification failed: ", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
