import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "session";

function secretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

async function readSession(req: NextRequest) {
  return {
    userId: "000000000000000000000000",
    name: "Public Student",
    email: "student@public.lms",
    role: "student" as const,
  };
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await readSession(req);

  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = pathname.startsWith("/student");

  if ((isAdminRoute || isStudentRoute) && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    url.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && session && session.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/student";
    return NextResponse.redirect(url);
  }

  if (isStudentRoute && session && session.role !== "student") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && session) {
    const url = req.nextUrl.clone();
    url.pathname = session.role === "admin" ? "/admin" : "/student";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/login"],
};
