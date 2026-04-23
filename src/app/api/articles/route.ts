import { NextResponse } from "next/server";
import { resources } from "@/lib/resources";
import type { Resource } from "@/lib/resources";

// GET /api/articles — list all articles
export async function GET() {
  return NextResponse.json({ articles: resources }, { status: 200 });
}

// POST /api/articles — create a new article
export async function POST(request: Request) {
  try {
    const apiSecretKey = process.env.API_SECRET_KEY;
    if (apiSecretKey) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader !== `Bearer ${apiSecretKey}`) {
        return NextResponse.json(
          { message: "Unauthorized. A valid Authorization: Bearer <token> header is required." },
          { status: 401 }
        );
      }
    } else if (process.env.NODE_ENV === "production") {
      console.error("[api/articles] API_SECRET_KEY is not set in production — blocking unauthenticated request.");
      return NextResponse.json(
        { message: "Endpoint is not available." },
        { status: 503 }
      );
    } else {
      console.warn("[api/articles] API_SECRET_KEY is not set — running in unauthenticated dev mode.");
    }

    const body = await request.json();

    const { slug, title, description, category, type, content, readTime, price } = body;

    // Validate required fields
    if (!slug || !title || !description || !category || !type || !content) {
      return NextResponse.json(
        {
          message:
            "Missing required fields. Please provide: slug, title, description, category, type, and content.",
        },
        { status: 400 }
      );
    }

    if (typeof slug !== "string" || typeof title !== "string") {
      return NextResponse.json(
        { message: "slug and title must be strings." },
        { status: 400 }
      );
    }

    if (type !== "free" && type !== "paid") {
      return NextResponse.json(
        { message: 'type must be either "free" or "paid".' },
        { status: 400 }
      );
    }

    if (type === "paid" && (price == null || typeof price !== "number" || price <= 0)) {
      return NextResponse.json(
        { message: "Paid articles must include a positive numeric price." },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = resources.find((r) => r.slug === slug);
    if (existing) {
      return NextResponse.json(
        { message: `An article with slug "${slug}" already exists.` },
        { status: 409 }
      );
    }

    const newArticle: Resource = {
      slug,
      title,
      description,
      category,
      type,
      image: body.image || "/images/default.svg",
      content,
      publishedAt: body.publishedAt || new Date().toISOString().split("T")[0],
      readTime: readTime || "5 min read",
      ...(type === "paid" && price ? { price } : {}),
    };

    // In-memory storage: push to the resources array.
    // NOTE: This is stored in memory and will reset on server restart.
    // For production, connect to a database (see README for instructions).
    resources.push(newArticle);

    console.log(`New article created: ${title} (${slug})`);

    return NextResponse.json(
      {
        message: "Article created successfully.",
        article: newArticle,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid request body. Please send valid JSON." },
      { status: 400 }
    );
  }
}
