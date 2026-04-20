import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // In a production app, you would integrate with an email service like:
    // - Mailchimp
    // - ConvertKit
    // - Resend
    // - SendGrid
    // For now, we'll simulate a successful subscription

    // Example: await addToMailingList(email);

    console.log(`New subscriber: ${email}`);

    return NextResponse.json(
      {
        message:
          "🎉 Welcome aboard! Check your inbox to confirm your subscription.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
