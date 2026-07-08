import os
from dotenv import load_dotenv
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("Missing Supabase environment variables in .env.local")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

batch_size = 100
offset = 0

while True:
    rows = (
        supabase.table("legal_chunks")
        .select("id, text_content")
        .is_("embedding", "null")
        .limit(batch_size)
        .execute()
        .data
    )

    if not rows:
        break

    texts = [row["text_content"] for row in rows]
    embeddings = model.encode(texts, normalize_embeddings=True).tolist()

    for row, embedding in zip(rows, embeddings):
        supabase.table("legal_chunks").update({"embedding": embedding}).eq("id", row["id"]).execute()

print("Backfill complete.")