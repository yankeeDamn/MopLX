import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Media } from "@/types/database";

// POST /api/media — upload media file
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const resourceId = formData.get("resource_id") as string | null;
    
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
      "video/mp4", "video/webm", "video/ogg"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only images and videos are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for images, 50MB for videos)
    const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const bucket = file.type.startsWith("video/") ? "videos" : "images";
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { message: "Failed to upload file", error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    // Save media record to database
    const { data: mediaRecord, error: dbError } = await supabase
      .from("media")
      // @ts-ignore - Known issue with Supabase SSR client type inference
      .insert({
        resource_id: resourceId,
        url: publicUrl,
        type: file.type.startsWith("video/") ? "video" : "image",
        filename: file.name,
        size_bytes: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Clean up uploaded file if database insert fails
      await supabase.storage.from(bucket).remove([fileName]);
      return NextResponse.json(
        { message: "Failed to save media record", error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Media uploaded successfully",
        media: mediaRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload media" },
      { status: 500 }
    );
  }
}

// GET /api/media — list media files
export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resource_id");

    let query = supabase.from("media").select("*").order("created_at", { ascending: false });
    
    if (resourceId) {
      query = query.eq("resource_id", resourceId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { message: "Failed to fetch media", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ media: data }, { status: 200 });
  } catch (error) {
    console.error("Media fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// DELETE /api/media — delete media file
export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("id");

    if (!mediaId) {
      return NextResponse.json(
        { message: "Media ID is required" },
        { status: 400 }
      );
    }

    // Get media record to find the file path
    // @ts-ignore - Known issue with Supabase SSR client type inference
    const { data: media, error: fetchError }: { data: Media | null; error: any } = await supabase
      .from("media")
      .select("*")
      .eq("id", mediaId)
      .single();

    if (fetchError || !media) {
      return NextResponse.json(
        { message: "Media not found" },
        { status: 404 }
      );
    }

    // Delete from storage
    const bucket = media.type === "video" ? "videos" : "images";
    const urlParts = media.url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    
    if (fileName && fileName.trim()) {
      await supabase.storage.from(bucket).remove([fileName]);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("media")
      .delete()
      .eq("id", mediaId);

    if (deleteError) {
      return NextResponse.json(
        { message: "Failed to delete media record", error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Media deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json(
      { message: "Failed to delete media" },
      { status: 500 }
    );
  }
}
