// /api/me/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
    return NextResponse.json(
      { loggedIn: true, user: { email: decoded.email } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
}
