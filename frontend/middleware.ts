import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;

  // soporte.ventasimple.cloud → redirigir a /soporte/*
  if (host.startsWith("soporte.")) {
    if (pathname.startsWith("/soporte") || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/soporte/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|brand/).*)"],
};
