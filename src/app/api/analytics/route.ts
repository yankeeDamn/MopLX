import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// POST /api/analytics — track an event
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();

    const { resource_id, event_type, platform } = body;

    if (!resource_id || !event_type) {
      return NextResponse.json(
        { message: "resource_id and event_type are required" },
        { status: 400 }
      );
    }

    if (!["view", "share", "click"].includes(event_type)) {
      return NextResponse.json(
        { message: "event_type must be 'view', 'share', or 'click'" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("analytics")
      // @ts-ignore - Known issue with Supabase SSR client type inference
      .insert({
        resource_id,
        event_type,
        platform: platform || null,
      });

    if (error) {
      console.error("Analytics insert error:", error);
      return NextResponse.json(
        { message: "Failed to track event", error: error.message },
        { status: 500 }
      );
    }

    // Increment views counter if it's a view event
    if (event_type === "view") {
      // @ts-ignore - RPC function not fully typed in Database definition
      await supabase.rpc("increment_views", { resource_uuid: resource_id });
    }

    return NextResponse.json(
      { message: "Event tracked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { message: "Failed to track event" },
      { status: 500 }
    );
  }
}

// GET /api/analytics — get analytics data
export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resource_id");
    const stats = searchParams.get("stats") === "true";

    // Check authentication for analytics data
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    if (stats && resourceId) {
      // Get aggregated stats for a specific resource
      // @ts-ignore - RPC function not fully typed in Database definition
      const { data, error } = await supabase.rpc("get_resource_stats", {
        resource_uuid: resourceId,
      });

      if (error) {
        return NextResponse.json(
          { message: "Failed to fetch stats", error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ stats: data?.[0] || null }, { status: 200 });
    }

    // Get raw analytics data
    let query = supabase.from("analytics").select("*").order("created_at", { ascending: false });
    
    if (resourceId) {
      query = query.eq("resource_id", resourceId);
    }

    const { data, error } = await query.limit(1000);

    if (error) {
      return NextResponse.json(
        { message: "Failed to fetch analytics", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ analytics: data }, { status: 200 });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
