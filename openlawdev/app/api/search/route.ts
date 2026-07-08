import { generateEmbedding, searchChunks } from "@/lib/rag/retrieve";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query: string = body.query ?? "";
    const topK: number = body.top_k ?? 5;

    if (!query.trim()) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Generate embedding
    const embedding = await generateEmbedding(query);

    // 2. Retrieve top-k chunks
    const results = await searchChunks(embedding, topK);

    // 3. Return ranked results
    return Response.json({
      query,
      results: results.map((r) => ({
        chunk_id: r.chunk_id,
        source_id: r.source_id,
        source_title: r.source_title,
        version_id: r.version_id,
        chunk_index: r.chunk_index,
        section_label: r.section_label,
        article_label: r.article_label,
        chunk_title: r.chunk_title,
        text_content: r.text_content,
        score: Math.round(r.score * 1000) / 1000,
        metadata: r.metadata,
      })),
    });
  } catch (error) {
    console.error("[api/search] Error:", error);
    return Response.json(
      { error: "Failed to process search" },
      { status: 500 },
    );
  }
}
