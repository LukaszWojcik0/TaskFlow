import { NextResponse } from "next/server";

import { db } from "@/db/db";
import { users } from "@/db/schema";

export async function GET() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users);

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
