-- Run this after the initial Prisma migration to add the pgvector column.
-- Neon and Supabase both support the vector extension; enable it first.
CREATE EXTENSION IF NOT EXISTS vector;

-- Add the embedding vector column to the Embedding table.
-- 1024 dimensions = Voyage AI voyage-3 output size.
-- Change to 1536 if switching to OpenAI text-embedding-3-small.
ALTER TABLE "Embedding" ADD COLUMN IF NOT EXISTS "vector" vector(1024);

-- IVFFlat index for approximate nearest-neighbour search.
-- lists = sqrt(num_rows) is a good starting point; tune as corpus grows.
CREATE INDEX IF NOT EXISTS embedding_vector_idx
  ON "Embedding" USING ivfflat ("vector" vector_cosine_ops)
  WITH (lists = 100);
