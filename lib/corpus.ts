// ament — corpus retrieval helpers
// All lens services retrieve depositions through this module.
// One corpus, many lenses — retrieval is shared infrastructure.

import { db } from "./db";
import { embed, retrieveSimilar } from "./embeddings";
import type { CitedDeposition } from "./prompts";

// Retrieve the most relevant depositions for a query string.
// Used by Mirror, Seam, and decision-memory.
export async function retrieveForQuery(
  organisationId: string,
  query: string,
  topK: number = 10
): Promise<CitedDeposition[]> {
  const queryVector = await embed(query);
  const similar = await retrieveSimilar(db, organisationId, queryVector, topK);

  if (similar.length === 0) return [];

  const depositionIds = similar.map((s) => s.depositionId);
  const depositions = await db.deposition.findMany({
    where: { id: { in: depositionIds }, organisationId },
    include: { author: { select: { name: true } } },
  });

  // Preserve similarity-order ranking
  const depositionMap = new Map(depositions.map((d) => [d.id, d]));
  return depositionIds
    .filter((id) => depositionMap.has(id))
    .map((id) => {
      const d = depositionMap.get(id)!;
      return {
        id: d.id,
        author: d.author.name || "Unknown",
        date: d.createdAt.toISOString(),
        excerpt: truncate(d.bodyPlain, 600),
        isAnchor: d.isAnchor,
        anchorLabel: d.anchorLabel || undefined,
      };
    });
}

// Retrieve all depositions for a given period (for Essay generation).
export async function retrieveForPeriod(
  organisationId: string,
  period: string
): Promise<CitedDeposition[]> {
  const depositions = await db.deposition.findMany({
    where: { organisationId, period },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
    take: 60, // cap to control Essay prompt size
  });

  return depositions.map((d) => ({
    id: d.id,
    author: d.author.name || "Unknown",
    date: d.createdAt.toISOString(),
    excerpt: truncate(d.bodyPlain, 800),
    isAnchor: d.isAnchor,
    anchorLabel: d.anchorLabel || undefined,
  }));
}

// Retrieve all Anchor depositions for an organisation (for Inheritance).
export async function retrieveAnchors(
  organisationId: string
): Promise<CitedDeposition[]> {
  const depositions = await db.deposition.findMany({
    where: { organisationId, isAnchor: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return depositions.map((d) => ({
    id: d.id,
    author: d.author.name || "Unknown",
    date: d.createdAt.toISOString(),
    excerpt: truncate(d.bodyPlain, 600),
    isAnchor: true,
    anchorLabel: d.anchorLabel || undefined,
  }));
}

// Retrieve a sample of depositions for Inheritance (across all time).
export async function retrieveCorpusSample(
  organisationId: string,
  limit: number = 30
): Promise<CitedDeposition[]> {
  const depositions = await db.deposition.findMany({
    where: { organisationId },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return depositions.map((d) => ({
    id: d.id,
    author: d.author.name || "Unknown",
    date: d.createdAt.toISOString(),
    excerpt: truncate(d.bodyPlain, 500),
    isAnchor: d.isAnchor,
    anchorLabel: d.anchorLabel || undefined,
  }));
}

// Compute the period string (e.g., "2024-Q1") from a date.
export function toPeriod(date: Date): string {
  const year = date.getFullYear();
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `${year}-Q${quarter}`;
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "…";
}
