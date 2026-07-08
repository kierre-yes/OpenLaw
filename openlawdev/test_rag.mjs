import { createClient } from "@supabase/supabase-js";
import { pipeline, env } from "@xenova/transformers";
import fs from "fs";

// Load .env.local manually to avoid needing dotenv package
const envContent = fs.readFileSync(".env.local", "utf-8");
envContent.split("\n").forEach(line => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  }
});

env.allowLocalModels = false;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testRAG() {
  const queryText = "What is the Official Gazette publication law?";
  console.log("Testing RAG Pipeline");
  console.log("Query:", queryText);

  console.log("1. Generating embedding via @xenova/transformers...");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  const output = await extractor(queryText, {
    pooling: "mean",
    normalize: true,
  });
  const embedding = Array.from(output.data);

  console.log("2. Searching Supabase via RPC...");
  const { data: documents, error } = await supabaseAdmin.rpc("match_legal_chunks", {
    query_embedding: JSON.stringify(embedding),
    match_threshold: -1.0,
    match_count: 5,
  });

  if (error) {
    console.error("Supabase Error:", error);
    return;
  }

  console.log(`Found ${documents ? documents.length : 0} chunks.`);
  
  if (documents && documents.length > 0) {
    console.log("\n--- Top Retrieved Chunk ---");
    console.log(documents[0]);
  }
}

testRAG();
