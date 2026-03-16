import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required", status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (error) {
    if (error.code === "23505") {
      // Duplicate email — treat as success so the popup still dismisses
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Something went wrong", status: 500 });
  }

  return NextResponse.json({ success: true });
}
