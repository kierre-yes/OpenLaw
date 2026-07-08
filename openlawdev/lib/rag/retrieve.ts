import { createClient } from "@supabase/supabase-js";
import { pipeline, env } from "@xenova/transformers";

// Disable local model directory in serverless environments
env.allowLocalModels = false;

// ---------------------------------------------------------------------------
// Supabase Admin — bypasses RLS for vector search
// ---------------------------------------------------------------------------
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export { supabaseAdmin };

// ---------------------------------------------------------------------------
// Embedding singleton — avoids reloading the model on every request
// ---------------------------------------------------------------------------
class PipelineSingleton {
  static task = "feature-extraction" as const;
  static model = "Xenova/all-MiniLM-L6-v2";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static instance: Promise<any> | null = null;

  static async getInstance() {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model);
    }
    return this.instance;
  }
}

/** Generate a 384-dim embedding for a text string. */
export async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await PipelineSingleton.getInstance();
  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

// ---------------------------------------------------------------------------
// Vector math
// ---------------------------------------------------------------------------
function dotProduct(a: number[], b: number[]) {
  return a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
}

function magnitude(v: number[]) {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

function cosineSimilarity(a: number[], b: number[]) {
  const ma = magnitude(a);
  const mb = magnitude(b);
  if (!ma || !mb) return -1;
  return dotProduct(a, b) / (ma * mb);
}

// ---------------------------------------------------------------------------
// Chunk search result type
// ---------------------------------------------------------------------------
export type RetrievedChunk = {
  chunk_id: string;
  source_id: string;
  source_title: string;
  short_title: string | null;
  source_type: string | null;
  jurisdiction: string | null;
  official_url: string | null;
  publication_date: string | null;
  version_id: string;
  version_label: string | null;
  chunk_index: number;
  section_label: string | null;
  article_label: string | null;
  chunk_title: string | null;
  text_content: string;
  score: number;
  metadata: Record<string, unknown> | null;
};

// ---------------------------------------------------------------------------
// Core retrieval — fetch chunks, rank by cosine similarity
// ---------------------------------------------------------------------------
export async function searchChunks(
  queryEmbedding: number[],
  topK = 5,
  threshold = 0.1,
): Promise<RetrievedChunk[]> {
  const { data: allChunks, error } = await supabaseAdmin
    .from("legal_chunks")
    .select(`
      id,
      source_version_id,
      chunk_index,
      section_label,
      article_label,
      chunk_title,
      text_content,
      embedding,
      metadata,
      legal_source_versions!inner (
        id,
        version_label,
        status,
        is_current,
        legal_sources!inner (
          id,
          title,
          short_title,
          source_type,
          jurisdiction,
          official_url,
          publication_date
        )
      )
    `);

  if (error) {
    console.error("[retrieve] Supabase fetch error:", error);
    return [];
  }

  const scored = (allChunks ?? [])
    .map((chunk: Record<string, unknown>) => {
      let parsedEmb = chunk.embedding;
      if (typeof parsedEmb === "string") {
        try {
          parsedEmb = JSON.parse(parsedEmb);
        } catch {
          parsedEmb = null;
        }
      }

      const sim =
        Array.isArray(parsedEmb) && parsedEmb.length === 384
          ? cosineSimilarity(queryEmbedding, parsedEmb as number[])
          : -1;

      const version = chunk.legal_source_versions as Record<string, unknown>;
      const source = version?.legal_sources as Record<string, unknown>;

      return {
        chunk_id: chunk.id as string,
        source_id: (source?.id as string) ?? "",
        source_title: (source?.title as string) ?? "Unknown",
        short_title: (source?.short_title as string) ?? null,
        source_type: (source?.source_type as string) ?? null,
        jurisdiction: (source?.jurisdiction as string) ?? null,
        official_url: (source?.official_url as string) ?? null,
        publication_date: (source?.publication_date as string) ?? null,
        version_id: (version?.id as string) ?? "",
        version_label: (version?.version_label as string) ?? null,
        chunk_index: chunk.chunk_index as number,
        section_label: (chunk.section_label as string) ?? null,
        article_label: (chunk.article_label as string) ?? null,
        chunk_title: (chunk.chunk_title as string) ?? null,
        text_content: (chunk.text_content as string) ?? "",
        score: sim,
        metadata: (chunk.metadata as Record<string, unknown>) ?? null,
      } satisfies RetrievedChunk;
    });

  const initialTopChunks = scored
    .filter((c) => c.score > threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Parent-Child Expansion: 
  // If an Article heading matches strongly, pull in its top sections to ensure substantive text is provided.
  const expandedSet = new Map<string, RetrievedChunk>();

  for (const chunk of initialTopChunks) {
    if (!expandedSet.has(chunk.chunk_id)) {
      expandedSet.set(chunk.chunk_id, chunk);
    }

    // If this chunk is a broad heading (e.g. "ARTICLE III" with no section)
    if (chunk.article_label && !chunk.section_label) {
      // Find actual substantive sections under this article
      const children = scored.filter(
        (c) => c.article_label === chunk.article_label && c.section_label
      );
      
      // Take the top 5 highest-scoring sections within this article
      const topChildren = children
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
        
      for (const child of topChildren) {
        if (!expandedSet.has(child.chunk_id)) {
          expandedSet.set(child.chunk_id, child);
        }
      }
    }
  }

  // Convert back to array, re-sort by score, and allow a slightly larger window (topK + 5) for the expanded context
  const finalChunks = Array.from(expandedSet.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topK + 5);

  console.log(
    `[retrieve] ${allChunks?.length ?? 0} total chunks → ${finalChunks.length} chunks after parent-child expansion (threshold: ${threshold})`,
  );

  return finalChunks;
}
