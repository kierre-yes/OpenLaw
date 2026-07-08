import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Initialize OpenRouter with the key from environment
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
import { streamText, convertToModelMessages } from "ai";
import {
  generateEmbedding,
  searchChunks,
  supabaseAdmin,
  type RetrievedChunk,
} from "@/lib/rag/retrieve";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawMessages = body.messages;

    const incomingMessages = Array.isArray(rawMessages)
      ? rawMessages
      : Array.isArray(rawMessages?.messages)
        ? rawMessages.messages
        : [];

    if (incomingMessages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const latestMessage = incomingMessages[incomingMessages.length - 1];

    // Normalize content (handles complex multi-part messages)
    const queryText =
      typeof latestMessage.content === "string"
        ? latestMessage.content
        : Array.isArray(latestMessage.content)
          ? latestMessage.content
              .map((part: { type: string; text?: string }) =>
                part.type === "text" ? part.text : "",
              )
              .join(" ")
          : "";

    // 1. Generate embedding for the user query
    const embedding = await generateEmbedding(queryText);

    // 2. Retrieve top-k chunks via shared utility
    const documents: RetrievedChunk[] = await searchChunks(embedding, 8); // Increased to 8 for better coverage

    // 3. Format context with citations
    const context = documents
      .map((doc) =>
        [
          `[Source Title: ${doc.source_title}]`,
          `[Short Title: ${doc.short_title ?? "Unknown"}]`,
          `[Source Type: ${doc.source_type ?? "Unknown"}]`,
          `[Jurisdiction: ${doc.jurisdiction ?? "Unknown"}]`,
          `[Publication Date: ${doc.publication_date ?? "Unknown"}]`,
          `[Version Label: ${doc.version_label ?? "Unknown"}]`,
          `[Chunk ID: ${doc.chunk_id}]`,
          `[Section: ${doc.section_label ?? "Unknown"}]`,
          `[Article: ${doc.article_label ?? "Unknown"}]`,
          `[Chunk Title: ${doc.chunk_title ?? "Unknown"}]`,
          doc.text_content,
        ].join("\n"),
      )
      .join("\n\n---\n\n");

    // 4. Build system prompt
    const systemPrompt = `You are a Philippine Legal Assistant named OpenLaw.
You MUST answer the user's question based ONLY on the following context.
If the context does not contain the answer, say "I don't have enough information in my verifiable sources to answer that."

When you provide facts from the context, please cite the [Source Title] and [Article/Section] appropriately so the user can verify it. Include a direct answer, a brief explanation, and the source citation. Refuse ONLY if the retrieved text does not contain relevant information.

Context:
${context || "No relevant legal context found."}
`;

    console.log("[chat] Generated Context Length:", context.length);

    // 5. Stream the response from OpenRouter
    const result = await streamText({
      model: openrouter("openrouter/free"), // Stable free routing
      system: systemPrompt,
      messages: await convertToModelMessages(
        incomingMessages.filter((m: { role: string }) => m.role !== "system"),
      ),
      temperature: 0.1, // Low temperature for factual RAG responses
      async onFinish({ text }) {
        // Fire-and-forget: save to chat_sessions + chat_messages
        try {
          const retrievedChunkIds = documents.map((d) => d.chunk_id);
          const grounded = documents.length > 0;

          // Create session
          const { data: session } = await supabaseAdmin
            .from("chat_sessions")
            .insert({ title: queryText.slice(0, 100) })
            .select("id")
            .single();

          if (session) {
            // Insert message pair
            await supabaseAdmin.from("chat_messages").insert([
              {
                session_id: session.id,
                role: "user",
                content: queryText,
                retrieved_chunk_ids: null,
              },
              {
                session_id: session.id,
                role: "assistant",
                content: text,
                retrieved_chunk_ids:
                  retrievedChunkIds.length > 0 ? retrievedChunkIds : null,
              },
            ]);

            console.log(
              `[chat] Saved session ${session.id} (grounded: ${grounded})`,
            );
          }
        } catch (saveErr) {
          // Don't break the response if saving fails
          console.error("[chat] Failed to save history:", saveErr);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("RAG Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process RAG request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
