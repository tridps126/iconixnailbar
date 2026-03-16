import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { resendClient } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, lastName, email, phone } = body;
  const name = `${(firstName ?? "").trim()} ${(lastName ?? "").trim()}`.trim();

  if (!name || !phone) {
    return NextResponse.json(
      { error: "First name, last name, and phone are required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc("insert_soft_opening_reservation", {
    p_name: name,
    p_email: email || null,
    p_phone: phone,
  });

  if (error) {
    if (error.code === "P0001" && error.message.includes("SPOTS_FULL")) {
      return NextResponse.json({ error: "spots_full" }, { status: 409 });
    }
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "already_registered" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  // Notify admin — fire and forget, never block the response
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  if (adminEmail && process.env.RESEND_API_KEY) {
    resendClient.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Entry — ${name}`,
      text: `A new giveaway entry was just submitted.\n\nName: ${name}\nEmail: ${email || "not provided"}\nPhone: ${phone}`,
    }).catch(() => {
      // Silently ignore — entry already saved, notification is best-effort
    });
  }

  return NextResponse.json({ success: true });
}
