import { type NextRequest, NextResponse } from "next/server";

// Email verification is now handled by Supabase via /api/auth/callback.
// This route redirects old links to the sign-in page.
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/signin?message=use-supabase-link", request.url));
}
