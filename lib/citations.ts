// ament — citation integrity
//
// The Mirror, Seam, and Inheritance lenses must only cite depositions that
// were actually retrieved and passed to the LLM as context. This module
// provides the check used by every lens API route, and is covered by
// tests/citation-integrity.test.ts.

import type { CitedDeposition } from "./prompts";

export interface CitationCheckResult {
  // Depositions from the retrieved set that the answer appears to cite.
  citedDepositionIds: string[];
  // True if the answer contains an [Author, date]-style citation that does
  // NOT match any author in the retrieved set — a sign of fabrication.
  hasUnverifiedCitation: boolean;
}

// Matches "[Name, 3 January 2025]" or "[Name Surname, date]" style citations.
const CITATION_PATTERN = /\[([^,\]]+),\s*[^\]]+\]/g;

// Check which retrieved depositions are cited in the answer, and flag any
// citation that references an author not present in the retrieved set.
export function checkCitations(
  answer: string,
  retrieved: CitedDeposition[]
): CitationCheckResult {
  const retrievedAuthors = new Set(retrieved.map((d) => d.author));

  const citedDepositionIds = retrieved
    .filter((d) => answer.includes(d.author))
    .map((d) => d.id);

  let hasUnverifiedCitation = false;
  for (const match of answer.matchAll(CITATION_PATTERN)) {
    const author = match[1].trim();
    if (!retrievedAuthors.has(author)) {
      hasUnverifiedCitation = true;
      break;
    }
  }

  return { citedDepositionIds, hasUnverifiedCitation };
}
