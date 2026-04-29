import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${BACKEND}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const response = NextResponse.json({
    nombre:    data.nombre,
    rol:       data.rol,
    tenant_id: data.tenant_id ?? null,
  });
  response.cookies.set("panel_token", data.token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    path:     "/",
    maxAge:   60 * 60 * 24,
  });
  return response;
}
