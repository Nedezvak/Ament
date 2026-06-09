// Tests the citation-integrity check used by the Mirror, Seam, and
// Inheritance lenses: answers must only cite depositions actually retrieved.

import { describe, it, expect } from "vitest";
import { checkCitations } from "@/lib/citations";
import type { CitedDeposition } from "@/lib/prompts";

const retrieved: CitedDeposition[] = [
  {
    id: "dep_1",
    author: "Mariëlle Voss",
    date: "2025-08-04",
    excerpt: "We have decided to decline the Meridian engagement...",
    isAnchor: true,
    anchorLabel: "Declined the Meridian retail roll-up engagement",
  },
  {
    id: "dep_2",
    author: "Daan Kessler",
    date: "2025-09-26",
    excerpt: "The partnership has voted to proceed with a Zurich presence...",
  },
];

describe("checkCitations", () => {
  it("identifies cited depositions from retrieved set", () => {
    const answer =
      "The organisation declined the Meridian engagement on reputational grounds [Mariëlle Voss, 4 August 2025].";
    const result = checkCitations(answer, retrieved);
    expect(result.citedDepositionIds).toEqual(["dep_1"]);
    expect(result.hasUnverifiedCitation).toBe(false);
  });

  it("identifies multiple cited depositions", () => {
    const answer =
      "Mariëlle Voss raised concerns [Mariëlle Voss, 4 August 2025] while Daan Kessler argued for expansion [Daan Kessler, 26 September 2025].";
    const result = checkCitations(answer, retrieved);
    expect(result.citedDepositionIds.sort()).toEqual(["dep_1", "dep_2"]);
  });

  it("flags a citation referencing an author not in the retrieved set", () => {
    const answer =
      "According to [Sophie Lindqvist, 8 July 2025], the firm raised risk concerns.";
    const result = checkCitations(answer, retrieved);
    expect(result.hasUnverifiedCitation).toBe(true);
    expect(result.citedDepositionIds).toEqual([]);
  });

  it("returns no citations when the answer cites nobody (thin corpus)", () => {
    const answer = "The corpus holds little on this question as yet.";
    const result = checkCitations(answer, retrieved);
    expect(result.citedDepositionIds).toEqual([]);
    expect(result.hasUnverifiedCitation).toBe(false);
  });
});
