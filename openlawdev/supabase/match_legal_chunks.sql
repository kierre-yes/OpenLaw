-- Standard Supabase pgvector RAG function
-- Run this in your Supabase Dashboard SQL Editor

create or replace function match_legal_chunks_with_sources (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  chunk_id uuid,
  source_id uuid,
  source_title text,
  short_title text,
  source_type text,
  jurisdiction text,
  official_url text,
  publication_date date,
  version_id uuid,
  version_label text,
  chunk_index integer,
  section_label text,
  article_label text,
  chunk_title text,
  text_content text,
  metadata jsonb,
  score float
)
language sql stable
as $$
  select
    c.id as chunk_id,
    s.id as source_id,
    s.title as source_title,
    s.short_title,
    s.source_type,
    s.jurisdiction,
    s.official_url,
    s.publication_date,
    v.id as version_id,
    v.version_label,
    c.chunk_index,
    c.section_label,
    c.article_label,
    c.chunk_title,
    c.text_content,
    c.metadata,
    1 - (c.embedding <=> query_embedding) as score
  from legal_chunks c
  join legal_source_versions v on c.source_version_id = v.id
  join legal_sources s on v.source_id = s.id
  where 1 - (c.embedding <=> query_embedding) > match_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
