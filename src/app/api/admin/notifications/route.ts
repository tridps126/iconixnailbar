import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/admin-auth";
import { createServiceClient } from "@/utils/supabase/service";
import { resendClient } from "@/lib/resend";

function buildEmailHtml(subject: string, body: string): string {
  // Convert plain text to HTML: double newlines → paragraphs, single → <br>
  const htmlBody = body
    .split(/\n{2,}/)
    .map((para) =>
      `<p style="margin:0 0 16px 0;line-height:1.7;color:#2C2424;">${para
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")}</p>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${subject.replace(/</g, "&lt;")}</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#FAF7F2;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#6B3A3A;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#E8C4B8;">
                Iconix Nail Bar
              </p>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#FAF7F2;line-height:1.3;">
                ${subject.replace(/</g, "&lt;")}
              </h1>
            </td>
          </tr>

          <!-- GOLD DIVIDER -->
          <tr>
            <td style="background-color:#C4A265;height:3px;"></td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px 40px 32px 40px;">
              ${htmlBody}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#F5EDE3;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #E8C4B8;">
              <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#6B3A3A;">
                Iconix Nail Bar
              </p>
              <p style="margin:0 0 12px 0;font-size:12px;color:#9A8C84;line-height:1.5;">
                We can't wait to see you!
              </p>
              <p style="margin:0;font-size:11px;color:#9A8C84;">
                You're receiving this because you signed up with Iconix Nail Bar.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

type Audience = "contacts" | "reservations" | "newsletter";

const TABLE_MAP: Record<Audience, string> = {
  contacts: "contact_submissions",
  reservations: "soft_opening_reservations",
  newsletter: "newsletter_subscribers",
};

const VALID_AUDIENCES: Audience[] = ["contacts", "reservations", "newsletter"];
const BATCH_SIZE = 100;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function POST(request: NextRequest) {
  // Re-verify session
  const token = request.cookies.get("admin_session")?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const isValid = await verifySession(token ?? "", secret);
  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Guard: Resend configured
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Email service not configured." },
      { status: 500 }
    );
  }

  // Parse + validate body
  let body: { audience: unknown; recipientIds: unknown; subject: unknown; body: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { audience, recipientIds, subject, body: emailBody } = body;

  if (!VALID_AUDIENCES.includes(audience as Audience)) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Invalid audience." },
      { status: 400 }
    );
  }
  if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "No recipients selected." },
      { status: 400 }
    );
  }
  if (typeof subject !== "string" || subject.trim().length === 0) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Subject is required." },
      { status: 400 }
    );
  }
  if (typeof emailBody !== "string" || emailBody.trim().length < 10) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Body must be at least 10 characters." },
      { status: 400 }
    );
  }

  // Re-fetch emails from DB — never trust client-sent addresses
  const supabase = createServiceClient();
  const { data, error: dbError } = await supabase
    .from(TABLE_MAP[audience as Audience])
    .select("id, email")
    .in("id", recipientIds as string[]);

  if (dbError || !data) {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to fetch recipients." },
      { status: 500 }
    );
  }

  if (data.length === 0) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "No matching recipients found." },
      { status: 400 }
    );
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const trimmedBody = emailBody.trim();
  const emailHtml = buildEmailHtml(subject.trim(), trimmedBody);

  const messages = data.map((row: { id: string; email: string }) => ({
    from: fromAddress,
    to: row.email,
    subject: subject.trim(),
    html: emailHtml,
    text: trimmedBody, // plain-text fallback for email clients that don't render HTML
  }));

  // Batch send in chunks of 100
  let sentCount = 0;
  const failedEmails: string[] = [];

  try {
    const chunks = chunkArray(messages, BATCH_SIZE);
    for (const chunk of chunks) {
      const result = await resendClient.batch.send(chunk);

      // Resend batch returns { data: [...], error }
      console.log("[notifications] Resend result:", JSON.stringify(result, null, 2));
      if (result.error) {
        // Check for rate limit
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resendError = result.error as any;
        console.error("[notifications] Resend error:", resendError);
        if (resendError?.statusCode === 429 || resendError?.name === "rate_limit_exceeded") {
          return NextResponse.json(
            { error: "RATE_LIMITED", message: "Rate limit reached. Try again shortly." },
            { status: 429 }
          );
        }
        // Surface the actual Resend error message to the client
        return NextResponse.json(
          { error: "SERVER_ERROR", message: resendError?.message ?? "Resend returned an error." },
          { status: 500 }
        );
      }

      // Count per-email results — result.data is CreateBatchSuccessResponse, its .data is the array
      const batchData = (result.data as unknown as { data: Array<{ id: string }> } | null)?.data ?? null;
      if (batchData) {
        for (let i = 0; i < chunk.length; i++) {
          const item = batchData[i];
          if (item && item.id) {
            sentCount++;
          } else {
            failedEmails.push(chunk[i].to as string);
          }
        }
      } else {
        sentCount += chunk.length;
      }
    }
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = err as any;
    if (e?.statusCode === 429 || e?.name === "rate_limit_exceeded") {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: "Rate limit reached. Try again shortly." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "SERVER_ERROR", message: e?.message ?? "Unexpected error sending emails." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    sentCount,
    failedCount: failedEmails.length,
    failedEmails,
  });
}
