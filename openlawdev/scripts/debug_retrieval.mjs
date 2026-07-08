// Test: what does the retrieval pipeline return for a Section 12 query?
import fs from "fs";
import { pipeline, env } from "@xenova/transformers";

fs.readFileSync(".env.local", "utf-8").split("\n").forEach(l => {
  if (l.trim() && !l.startsWith("#")) {
    const [k, ...v] = l.split("=");
    process.env[k.trim()] = v.join("=").trim();
  }
});
env.allowLocalModels = false;

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const query = "What are the rights of a person under investigation for a crime in the Philippines?";
  console.log("Query:", query);

  // Generate embedding
  console.log("\n1. Generating embedding...");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  const output = await extractor(query, { pooling: "mean", normalize: true });
  const embedding = Array.from(output.data);
  console.log("Embedding dim:", embedding.length);

  // Fetch ALL chunks
  console.log("\n2. Fetching all chunks...");
  const { data: allChunks, error } = await sb
    .from("legal_chunks")
    .select("id, chunk_index, section_label, article_label, chunk_title, text_content, embedding, metadata, source_version_id");

  if (error) { console.error("Fetch error:", error); return; }
  console.log("Total chunks in DB:", allChunks.length);

  // Cosine similarity
  function dot(a, b) { return a.reduce((s, v, i) => s + v * (b[i] || 0), 0); }
  function mag(v) { return Math.sqrt(v.reduce((s, x) => s + x * x, 0)); }
  function cosine(a, b) {
    const ma = mag(a), mb = mag(b);
    if (!ma || !mb) return -1;
    return dot(a, b) / (ma * mb);
  }

  // Score all chunks
  const scored = allChunks.map(c => {
    let emb = c.embedding;
    if (typeof emb === "string") { try { emb = JSON.parse(emb); } catch { emb = null; } }
    const sim = Array.isArray(emb) && emb.length === 384 ? cosine(embedding, emb) : -1;
    return { ...c, score: sim, embedding: undefined };
  }).sort((a, b) => b.score - a.score);

  // Show top 10
  console.log("\n3. TOP 10 RESULTS:");
  for (const r of scored.slice(0, 10)) {
    console.log("  score=" + r.score.toFixed(4) + " | " + r.article_label + " " + r.section_label + " | '" + r.chunk_title + "' | text=" + (r.text_content?.length || 0) + "chars");
    if (r.score > 0.3) {
      console.log("    TEXT PREVIEW:", r.text_content?.substring(0, 150) + "...");
    }
  }

  // Show the current threshold filter
  const above01 = scored.filter(c => c.score > 0.1);
  const above02 = scored.filter(c => c.score > 0.2);
  const above03 = scored.filter(c => c.score > 0.3);
  console.log("\n4. THRESHOLD ANALYSIS:");
  console.log("  > 0.1:", above01.length, "chunks");
  console.log("  > 0.2:", above02.length, "chunks");
  console.log("  > 0.3:", above03.length, "chunks");

  // Is the right Section 12 in top 5?
  const top5 = scored.slice(0, 5);
  const hasSection12 = top5.some(c => c.article_label === "ARTICLE III" && c.section_label === "SECTION 12");
  console.log("\n5. Is Art III Sec 12 in top 5?", hasSection12);

  // Where does Art III Sec 12 rank?
  const s12idx = scored.findIndex(c => c.article_label === "ARTICLE III" && c.section_label === "SECTION 12");
  if (s12idx >= 0) {
    console.log("  Rank:", s12idx + 1, "of", scored.length, "| Score:", scored[s12idx].score.toFixed(4));
  }
}

main();
