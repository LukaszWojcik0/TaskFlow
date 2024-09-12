import { NextResponse } from "next/server";
import { users } from "@/db/schema";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const passwordValidate = await bcrypt.compare(password, user[0].password);

    if (!passwordValidate) {
      return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Logged in succesfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
