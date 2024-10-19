import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  console.log(`Accessing: ${pathname}`);
  console.log(`Token: ${token ? "Present" : "Not Present"}`);

  const protectedRoutes = ["/dashboard"];

  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET_KEY);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
