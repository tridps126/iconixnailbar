import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./lib/admin-auth";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path == "/admin/login") {
    //If they have a valid session then send them straight to dashboard
    const cookie = request.cookies.get("admin_session");
    if (cookie !== undefined) {
      const secret = process.env.ADMIN_SESSION_SECRET;
      const isValid = await verifySession(cookie.value, secret);
      if (isValid) {
        return NextResponse.redirect(new URL("/admin/contacts", request.url));
      }
    }
    //If they don't have a valid session then let them see the admin login
    return NextResponse.next();
  }

  //For all other admin/* routes then check for the session
  const cookie = request.cookies.get("admin_session");

  if (cookie === undefined) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  const isValid = await verifySession(cookie.value, secret);
  if (!isValid) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
