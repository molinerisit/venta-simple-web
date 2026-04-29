import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const NEXT_AUTH_PATHS = ["/api/auth/login", "/api/auth/logout", "/api/auth/set-session"];

export function middleware(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;

  // soporte.ventasimple.cloud → redirigir a /soporte/*
  if (host.startsWith("soporte.")) {
    if (pathname.startsWith("/soporte") || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/soporte/login", request.url));
  }

  // Inyectar Authorization desde cookie httpOnly para requests proxiados al backend
  const token = request.cookies.get("panel_token")?.value;
  if (
    token &&
    pathname.startsWith("/api/") &&
    !NEXT_AUTH_PATHS.some((p) => pathname.startsWith(p))
  ) {
    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|brand/).*)"],
};
