import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: "Newsletter signup is not available yet. Please check back soon." },
        { status: 503 }
      );
    }

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
