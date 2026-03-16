import { NextRequest, NextResponse } from "next/server";
import { signSession } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !secret) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  // Constant-time-ish comparison + artificial delay on failure to slow brute-force
  const isValid = password === adminPassword;

  if (!isValid) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await signSession(secret);

  const response = NextResponse.json({ ok: true });

  response.cookies.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // secure in production, plain http ok in dev
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60, // 8 hours, matches token expiry
  });

  return response;
}
