import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** Base URL for generating unsubscribe links in emails. */
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * POST /api/subscribe
 *
 * Accepts a JSON body `{ email: string }`, validates it, stores the address
 * in the `subscribers` table (Supabase/PostgreSQL), and sends a welcome email
 * via Resend (if RESEND_API_KEY is configured).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // ── 1. Validate input ──────────────────────────────────────────────────
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Normalize to lowercase to prevent duplicate entries from casing differences
    const normalizedEmail = email.toLowerCase().trim();

    // ── 2. Persist to database ─────────────────────────────────────────────
    // Use the admin client (service role) so we can insert regardless of RLS
    // policies. The anon key cannot write to `subscribers` by design.
    const supabase = createSupabaseAdminClient();

    const { data: subscriberData, error } = await supabase
      .from("subscribers")
      // @ts-ignore - Known issue with Supabase SSR client type inference for new tables
      .insert({ email: normalizedEmail, confirmed: false })
      .select("unsubscribe_token")
      .single();

    // Cast to known shape — the query above always selects unsubscribe_token
    const subscriber = subscriberData as { unsubscribe_token: string } | null;

    if (error) {
      // PostgreSQL unique-violation code: 23505
      if (error.code === "23505") {
        // Already subscribed — return a friendly message instead of an error
        return NextResponse.json(
          { message: "You're already subscribed! 🎉 Check your inbox for the weekly briefing." },
          { status: 200 }
        );
      }

      console.error("[subscribe] Supabase insert error:", error);
      return NextResponse.json(
        { message: "Something went wrong while saving your subscription. Please try again." },
        { status: 500 }
      );
    }

    console.log(`[subscribe] New subscriber: ${normalizedEmail}`);

    // ── 3. Send welcome email (best-effort, non-blocking) ──────────────────
    // If no RESEND_API_KEY is configured, sendEmail() logs to console instead
    // and still returns true, so the subscription is always saved regardless.
    const unsubscribeToken = subscriber?.unsubscribe_token ?? "";
    const unsubscribeUrl = `${APP_BASE_URL}/api/unsubscribe?token=${unsubscribeToken}`;
    await sendEmail({
      to: normalizedEmail,
      subject: "Welcome to the MopLX weekly briefing 🚀",
      html: getSubscriberWelcomeHtml(normalizedEmail, unsubscribeUrl),
    });

    return NextResponse.json(
      { message: "🎉 You're in! Expect your first briefing soon." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

/** Generates the HTML body for the subscriber welcome email. */
function getSubscriberWelcomeHtml(email: string, unsubscribeUrl: string): string {
  // Basic HTML-escape to prevent injection if email is ever rendered inside HTML
  const safeEmail = email.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#039;" }[c] ?? c)
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MopLX</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">

  <div style="background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:30px;border-radius:10px 10px 0 0;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:28px;">Welcome to MopLX 🚀</h1>
  </div>

  <div style="background:#ffffff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;">
    <p style="font-size:16px;margin-bottom:16px;">Hey ${safeEmail},</p>

    <p style="font-size:16px;margin-bottom:16px;">
      Thanks for subscribing to the <strong>MopLX weekly briefing</strong> — your source for
      practical DevOps, CloudOps, MLOps, and the rest of the XOps stack.
    </p>

    <p style="font-size:16px;margin-bottom:24px;">
      Here's what to expect every week:
    </p>

    <ul style="padding-left:20px;margin-bottom:24px;">
      <li style="margin-bottom:8px;">📖 One sharp XOps briefing, delivered each week</li>
      <li style="margin-bottom:8px;">🛠️ Free tutorials plus premium deep dives</li>
      <li style="margin-bottom:8px;">⚙️ Real-world examples you can apply immediately</li>
    </ul>

    <div style="text-align:center;margin:30px 0;">
      <a href="${APP_BASE_URL}/resources"
         style="background:#0c0a09;color:#fff;padding:14px 30px;border-radius:9999px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
        Browse Stories →
      </a>
    </div>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">
    <p style="font-size:12px;color:#9ca3af;text-align:center;">
      You're receiving this because you subscribed at moplx.com.<br>
      <a href="${unsubscribeUrl}" style="color:#9ca3af;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}
