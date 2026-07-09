import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "session";

function secretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

async function readSession(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as { userId: string; role: "admin" | "student"; name: string; email: string };
  } catch {
    return null;
  }
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

  if ((pathname === "/login" || pathname === "/signup") && session) {
    const url = req.nextUrl.clone();
    url.pathname = session.role === "admin" ? "/admin" : "/student";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/login", "/signup"],
};
