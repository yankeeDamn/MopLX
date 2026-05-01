import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import type { Subscriber } from "@/types/database";

/**
 * POST /api/newsletter/send
 *
 * Sends a newsletter email to **all active, confirmed subscribers**.
 *
 * Protected by the API_SECRET_KEY env var (recommended). In development
 * (NODE_ENV !== "production") the key check is skipped when the var is absent,
 * so you can test locally without extra configuration.
 *
 * Request body:
 * ```json
 * {
 *   "subject": "Your newsletter subject",
 *   "html": "<p>Full HTML body of the email</p>"
 * }
 * ```
 *
 * Curl example:
 * ```
 * curl -X POST http://localhost:3000/api/newsletter/send \
 *   -H "Authorization: Bearer <API_SECRET_KEY>" \
 *   -H "Content-Type: application/json" \
 *   -d '{"subject":"Weekly Briefing #1","html":"<p>Hello from MopLX!</p>"}'
 * ```
 */
export async function POST(request: Request) {
  // ── 1. Authorization ───────────────────────────────────────────────────────
  const apiSecretKey = process.env.API_SECRET_KEY;

  if (apiSecretKey) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${apiSecretKey}`) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // Require the key in production to prevent accidental open access
    console.error("[newsletter/send] API_SECRET_KEY is not set in production — blocking request.");
    return NextResponse.json({ message: "Endpoint is not available." }, { status: 503 });
  } else {
    console.warn("[newsletter/send] API_SECRET_KEY not set — running in unauthenticated dev mode.");
  }

  // ── 2. Parse and validate body ─────────────────────────────────────────────
  let subject: string;
  let html: string;

  try {
    const body = await request.json();
    subject = body.subject;
    html = body.html;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (!subject || typeof subject !== "string" || subject.trim() === "") {
    return NextResponse.json({ message: "A non-empty 'subject' string is required." }, { status: 400 });
  }
  if (!html || typeof html !== "string" || html.trim() === "") {
    return NextResponse.json({ message: "A non-empty 'html' string is required." }, { status: 400 });
  }

  // ── 3. Fetch active subscribers ────────────────────────────────────────────
  const supabase = createSupabaseAdminClient();

  // Only send to confirmed subscribers who have not unsubscribed
  // @ts-ignore - Known issue with Supabase SSR client type inference for new tables
  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("id, email, unsubscribe_token")
    .eq("confirmed", true)
    .is("unsubscribed_at", null);

  if (error) {
    console.error("[newsletter/send] Failed to fetch subscribers:", error);
    return NextResponse.json(
      { message: "Failed to retrieve subscriber list." },
      { status: 500 }
    );
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: "No active subscribers to send to.", sent: 0 }, { status: 200 });
  }

  // ── 4. Send emails ─────────────────────────────────────────────────────────
  const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let sentCount = 0;
  let failedCount = 0;

  for (const subscriber of subscribers as Pick<Subscriber, "id" | "email" | "unsubscribe_token">[]) {
    // Append a personalised unsubscribe footer to every outgoing email
    const unsubscribeUrl = `${APP_BASE_URL}/api/unsubscribe?token=${subscriber.unsubscribe_token}`;
    const personalizedHtml = appendUnsubscribeFooter(html, unsubscribeUrl);

    const success = await sendEmail({
      to: subscriber.email,
      subject,
      html: personalizedHtml,
    });

    if (success) {
      sentCount++;
    } else {
      failedCount++;
      console.warn(`[newsletter/send] Failed to send to ${subscriber.email}`);
    }
  }

  console.log(`[newsletter/send] Done — sent: ${sentCount}, failed: ${failedCount}`);

  return NextResponse.json(
    {
      message: `Newsletter sent to ${sentCount} subscriber(s).`,
      sent: sentCount,
      failed: failedCount,
    },
    { status: 200 }
  );
}

/**
 * Appends a standard unsubscribe footer to the provided HTML email body.
 * If the HTML already has a `</body>` tag the footer is inserted before it;
 * otherwise it is appended at the end.
 */
function appendUnsubscribeFooter(html: string, unsubscribeUrl: string): string {
  const footer = `
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;text-align:center;">
  <p style="font-size:12px;color:#9ca3af;">
    You're receiving this because you subscribed to the MopLX newsletter.<br>
    <a href="${unsubscribeUrl}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div>`;

  if (html.includes("</body>")) {
    return html.replace("</body>", `${footer}</body>`);
  }
  return html + footer;
}
