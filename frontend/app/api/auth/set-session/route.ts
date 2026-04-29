import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "token requerido" }, { status: 400 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("panel_token", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    path:     "/",
    maxAge:   60 * 60 * 24,
  });
  return response;
}
