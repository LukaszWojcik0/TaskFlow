import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { z } from "zod";

import { db } from "@/db/db";
import { users } from "@/db/schema";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - Token missing" },
        { status: 401 },
      );
    }

    const { password, confirmPassword } = await request.json();

    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 },
      );
    }
    let payload;
    try {
      ({ payload } = await jwtVerify(token, SECRET_KEY));
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { message: "Unauthorized - Token verification failed" },
        { status: 401 },
      );
    }

    const userId = Number(payload.id);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid user ID" },
        { status: 401 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Error updating password" },
      { status: 500 },
    );
  }
}
