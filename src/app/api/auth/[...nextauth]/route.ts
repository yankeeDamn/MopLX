// Auth is now handled by Supabase — see /api/auth/callback/route.ts
// This file is kept to avoid 404s from old bookmarks.
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect(new URL("/signin", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
}
export function POST() {
  return NextResponse.json({ error: "Use Supabase Auth" }, { status: 410 });
}
