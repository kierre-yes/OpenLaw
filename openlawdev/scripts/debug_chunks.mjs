// Diagnostic: inspect Article III chunks and Section 12 specifically
import fs from "fs";
fs.readFileSync(".env.local", "utf-8").split("\n").forEach(l => {
  if (l.trim() && !l.startsWith("#")) {
    const [k, ...v] = l.split("=");
    process.env[k.trim()] = v.join("=").trim();
  }
});

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // 1. All Article III chunks
  const { data: art3, error } = await sb
    .from("legal_chunks")
    .select("id, chunk_index, section_label, article_label, chunk_title, text_content, embedding")
    .ilike("article_label", "%III%")
    .order("chunk_index");

  if (error) { console.error("Error:", error); return; }

  console.log("=== ARTICLE III CHUNKS ===");
  console.log("Total:", art3?.length);
  for (const c of (art3 || [])) {
    const hasEmb = c.embedding !== null && c.embedding !== undefined;
    const textLen = c.text_content?.length || 0;
    console.log("  [" + c.chunk_index + "] " + c.article_label + " | " + c.section_label + " | '" + c.chunk_title + "' | text=" + textLen + "chars | hasEmbedding=" + hasEmb);
  }

  // 2. Section 12 specifically
  const { data: s12 } = await sb
    .from("legal_chunks")
    .select("id, chunk_index, section_label, article_label, chunk_title, text_content")
    .ilike("section_label", "%12%")
    .ilike("article_label", "%III%");

  console.log("\n=== SECTION 12 OF ARTICLE III ===");
  console.log("Count:", s12?.length);
  for (const c of (s12 || [])) {
    console.log("chunk_title:", c.chunk_title);
    console.log("text_content:", c.text_content);
    console.log("---");
  }

  // 3. Check total NULL embeddings remaining
  const { count } = await sb
    .from("legal_chunks")
    .select("id", { count: "exact", head: true })
    .is("embedding", null);

  console.log("\n=== REMAINING NULL EMBEDDINGS ===");
  console.log("Count:", count);
}

main();
