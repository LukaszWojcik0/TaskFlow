import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";

import { db } from "@/db/db";
import { users } from "@/db/schema";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user[0]) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const passwordValidate = await bcrypt.compare(password, user[0].password);

    if (!passwordValidate) {
      return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    }

    const token = await new SignJWT({ id: user[0].id, email: user[0].email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(SECRET_KEY);

    const response = NextResponse.json(
      { message: "Logged in successfully" },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
