import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/unsubscribe?token=<unsubscribe_token>
 *
 * One-click unsubscribe endpoint. The token is stored alongside each
 * subscriber record and included in every outgoing newsletter email.
 *
 * On success, sets `unsubscribed_at` to the current timestamp so the
 * subscriber is excluded from future sends while preserving the record
 * for audit purposes.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // Basic token format check (UUID v4)
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!token || !UUID_REGEX.test(token)) {
    return NextResponse.json(
      { message: "Invalid or missing unsubscribe token." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  // Find and update the subscriber in one round-trip
  const { data, error } = await supabase
    .from("subscribers")
    // @ts-ignore - Known issue with Supabase SSR client type inference for new tables
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null) // Only update if not already unsubscribed
    .select("email")
    .single();

  if (error || !data) {
    // Either the token doesn't exist or the user already unsubscribed
    return NextResponse.json(
      { message: "Unsubscribe link is invalid or already used." },
      { status: 404 }
    );
  }

  // Cast to known shape — the query above always selects email
  const subscriber = data as { email: string } | null;

  console.log(`[unsubscribe] ${subscriber?.email} unsubscribed via token`);

  // Redirect to a simple confirmation page (or the homepage)
  const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.redirect(`${APP_BASE_URL}/?unsubscribed=1`, { status: 302 });
}
