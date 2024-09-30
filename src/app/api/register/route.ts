import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  console.log(`Attempting to register user with email: ${email}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id, email: users.email });

    console.log("User registered successfully:", newUser[0]);

    return NextResponse.json(
      { message: "User registered successfully", user: newUser[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error && (error as any).code === "23505") {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
