// ament — embedding service
// Switch between Voyage AI and OpenAI via EMBEDDING_PROVIDER env var.
// All embedding calls go through `embed()` — never call provider SDKs directly.

import { VoyageAIClient } from "voyageai";

// Fail loudly if configuration is missing — better a clear startup error
// than a silent failure mid-request.
function assertEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(
      `Missing environment variable: ${name}. Check your .env.local file.`
    );
  }
  return val;
}

export type EmbeddingProvider = "voyage" | "openai";

export function getProvider(): EmbeddingProvider {
  const p = process.env.EMBEDDING_PROVIDER || "voyage";
  if (p !== "voyage" && p !== "openai") {
    throw new Error(
      `EMBEDDING_PROVIDER must be "voyage" or "openai", got: "${p}"`
    );
  }
  return p;
}

export function getEmbeddingDimensions(): number {
  const provider = getProvider();
  // voyage-3: 1024 dims. text-embedding-3-small: 1536 dims.
  return provider === "voyage" ? 1024 : 1536;
}

// Embed a single text string. Used for query-time embedding (Mirror, Seam).
export async function embed(text: string): Promise<number[]> {
  const provider = getProvider();
  if (provider === "voyage") {
    return embedWithVoyage([text]).then((vecs) => vecs[0]);
  }
  return embedWithOpenAI([text]).then((vecs) => vecs[0]);
}

// Embed a batch of texts. Used for corpus ingestion.
// Returns vectors in the same order as input texts.
export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const provider = getProvider();
  if (provider === "voyage") {
    return embedWithVoyage(texts);
  }
  return embedWithOpenAI(texts);
}

async function embedWithVoyage(texts: string[]): Promise<number[][]> {
  const apiKey = assertEnv("VOYAGE_API_KEY");
  const model = process.env.VOYAGE_MODEL || "voyage-3";

  const client = new VoyageAIClient({ apiKey });
  const response = await client.embed({
    input: texts,
    model,
  });

  if (!response.data || response.data.length !== texts.length) {
    throw new Error("Voyage AI returned unexpected embedding count");
  }

  return response.data.map((item) => {
    if (!item.embedding) throw new Error("Voyage AI returned null embedding");
    return item.embedding;
  });
}

async function embedWithOpenAI(texts: string[]): Promise<number[][]> {
  const apiKey = assertEnv("OPENAI_API_KEY");
  const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: texts, model }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI embeddings error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    data: Array<{ embedding: number[]; index: number }>;
  };

  // Sort by index to ensure correct order (API may return out of order)
  return data.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

// Store an embedding vector in the database.
// Uses raw SQL because Prisma doesn't support pgvector natively.
export async function storeEmbedding(
  db: import("@prisma/client").PrismaClient,
  depositionId: string,
  vector: number[],
  model: string
): Promise<string> {
  // Upsert: if embedding exists (re-embed scenario), update it.
  const vectorStr = `[${vector.join(",")}]`;

  const existing = await db.embedding.findUnique({ where: { depositionId } });

  if (existing) {
    await db.$executeRawUnsafe(
      `UPDATE "Embedding" SET "vector" = $1::vector, "model" = $2, "createdAt" = NOW() WHERE "depositionId" = $3`,
      vectorStr,
      model,
      depositionId
    );
    return existing.id;
  }

  const embedding = await db.embedding.create({
    data: {
      depositionId,
      model,
      dimensions: vector.length,
    },
  });

  await db.$executeRawUnsafe(
    `UPDATE "Embedding" SET "vector" = $1::vector WHERE "id" = $2`,
    vectorStr,
    embedding.id
  );

  return embedding.id;
}

// Retrieve the top-k most similar depositions to a query vector.
// Returns deposition IDs ordered by cosine similarity (descending).
// top_k is capped at 20 to control LLM context size and cost.
export async function retrieveSimilar(
  db: import("@prisma/client").PrismaClient,
  organisationId: string,
  queryVector: number[],
  topK: number = 10
): Promise<Array<{ depositionId: string; similarity: number }>> {
  const k = Math.min(topK, 20); // hard cap
  const vectorStr = `[${queryVector.join(",")}]`;

  const results = await db.$queryRawUnsafe<
    Array<{ deposition_id: string; similarity: number }>
  >(
    `SELECT e."depositionId" as deposition_id,
            1 - (e."vector" <=> $1::vector) as similarity
     FROM "Embedding" e
     JOIN "Deposition" d ON d.id = e."depositionId"
     WHERE d."organisationId" = $2
       AND e."vector" IS NOT NULL
     ORDER BY e."vector" <=> $1::vector
     LIMIT $3`,
    vectorStr,
    organisationId,
    k
  );

  return results.map((r) => ({
    depositionId: r.deposition_id,
    similarity: r.similarity,
  }));
}
