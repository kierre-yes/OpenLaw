import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional query params
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase() ?? "";
    const type = searchParams.get("type") ?? "";

    // Fetch all legal sources
    let query = supabase
      .from("legal_sources")
      .select(
        `
        id,
        title,
        short_title,
        source_type,
        jurisdiction,
        issuing_body,
        official_url,
        publication_date,
        effectivity_date,
        status,
        language,
        created_at
      `,
      )
      .order("title", { ascending: true });

    // Filter by source_type if provided
    if (type && type !== "All") {
      query = query.ilike("source_type", type);
    }

    const { data: sources, error } = await query;

    if (error) {
      console.error("[api/sources] Supabase error:", error);
      return Response.json(
        { error: "Failed to fetch sources" },
        { status: 500 },
      );
    }

    // Client-side text search (title + jurisdiction + short_title)
    const filtered = q
      ? (sources ?? []).filter(
          (s) =>
            s.title?.toLowerCase().includes(q) ||
            s.short_title?.toLowerCase().includes(q) ||
            s.jurisdiction?.toLowerCase().includes(q),
        )
      : (sources ?? []);

    return Response.json({ sources: filtered });
  } catch (err) {
    console.error("[api/sources] Unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
