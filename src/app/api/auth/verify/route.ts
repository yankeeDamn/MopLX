import { NextRequest, NextResponse } from "next/server";
import {
  findUserByVerificationToken,
  verifyUserEmail,
} from "@/lib/auth";
import { sendEmail, getWelcomeEmailHtml } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/signin?error=missing-token", request.url)
      );
    }

    const user = findUserByVerificationToken(token);

    if (!user) {
      return NextResponse.redirect(
        new URL("/signin?error=invalid-token", request.url)
      );
    }

    if (user.emailVerified) {
      return NextResponse.redirect(
        new URL("/signin?message=already-verified", request.url)
      );
    }

    // Verify the user
    const verified = verifyUserEmail(user.id);

    if (!verified) {
      return NextResponse.redirect(
        new URL("/signin?error=verification-failed", request.url)
      );
    }

    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: "Welcome to MopLX! 🎉",
      html: getWelcomeEmailHtml(user.name || user.email.split("@")[0]),
    });

    // Redirect to signin with success message
    return NextResponse.redirect(
      new URL("/signin?message=email-verified", request.url)
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      new URL("/signin?error=verification-failed", request.url)
    );
  }
}
