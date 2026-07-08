import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// GET — fetch chat sessions (with optional nested messages)
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/history] GET error:", error);
      return Response.json(
        { error: "Failed to fetch history" },
        { status: 500 },
      );
    }

    return Response.json({ sessions: sessions ?? [] });
  } catch (err) {
    console.error("[api/history] Unexpected GET error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST — create a new session with messages
// Body: { title, user_message, assistant_message, retrieved_chunk_ids?, grounded? }
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      user_message,
      assistant_message,
      retrieved_chunk_ids = [],
      grounded = true,
    } = body;

    if (!user_message) {
      return Response.json(
        { error: "user_message is required" },
        { status: 400 },
      );
    }

    // 1. Create session
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: user.id,
        title: title || user_message.slice(0, 100),
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      console.error("[api/history] Session create error:", sessionError);
      return Response.json(
        { error: "Failed to create session" },
        { status: 500 },
      );
    }

    // 2. Insert messages (user + assistant)
    const messages = [
      {
        session_id: session.id,
        role: "user",
        content: user_message,
        retrieved_chunk_ids: null,
      },
    ];

    if (assistant_message) {
      messages.push({
        session_id: session.id,
        role: "assistant",
        content: assistant_message,
        retrieved_chunk_ids: retrieved_chunk_ids.length > 0 ? retrieved_chunk_ids : null,
      });
    }

    const { error: msgError } = await supabase
      .from("chat_messages")
      .insert(messages);

    if (msgError) {
      console.error("[api/history] Message insert error:", msgError);
    }

    return Response.json({
      session_id: session.id,
      grounded,
    });
  } catch (err) {
    console.error("[api/history] Unexpected POST error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE — remove a session by id
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    // Delete messages first (cascade may handle this, but be explicit)
    await supabase.from("chat_messages").delete().eq("session_id", id);

    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("[api/history] DELETE error:", error);
      return Response.json(
        { error: "Failed to delete session" },
        { status: 500 },
      );
    }

    return Response.json({ deleted: true });
  } catch (err) {
    console.error("[api/history] Unexpected DELETE error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
