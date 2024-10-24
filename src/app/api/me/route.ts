import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import { db } from "@/db/db";
import { users } from "@/db/schema";

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export async function GET(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split("token=")[1]
    ?.split(";")[0];

  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, decoded.email));

    if (user) {
      return NextResponse.json(
        { loggedIn: true, user: { id: user.id, email: user.email } },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const response = NextResponse.json({ loggedIn: false }, { status: 200 });
      response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      });
      return response;
    } else {
      console.error("Error verifying token:", error);
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }
  }
}
