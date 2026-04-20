import { NextResponse } from "next/server";
import {
  createUser,
  findUserByEmail,
} from "@/lib/auth";
import { sendEmail, getVerificationEmailHtml } from "@/lib/email";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate email
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Validate password
    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser(email, password, name);

    // Generate verification URL
    const baseUrl = process.env.NEXTAUTH_URL || "https://mop-lx.vercel.app";
    const verificationUrl = `${baseUrl}/api/auth/verify?token=${user.verificationToken}`;

    // Send verification email
    const emailSent = await sendEmail({
      to: email,
      subject: "Verify your MopLX account",
      html: getVerificationEmailHtml(name || email.split("@")[0], verificationUrl),
    });

    if (!emailSent && process.env.RESEND_API_KEY) {
      console.error("Failed to send verification email to:", email);
    }

    return NextResponse.json(
      {
        message: "Account created successfully! Please check your inbox to verify your email.",
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
