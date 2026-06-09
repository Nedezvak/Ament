// Integration test: the Seam detects the planted disagreements in the
// seeded "Halden Partners" corpus — expansion strategy (Mariëlle vs. Daan)
// and risk tolerance in client recommendations (Sophie vs. Daan).
//
// REQUIRES: a seeded database, EMBEDDING_PROVIDER and ANTHROPIC_API_KEY
// credentials. Skipped automatically if these are not configured.
// This test makes one Anthropic API call (~$0.001).

import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/lib/db";
import { retrieveForQuery } from "@/lib/corpus";
import { buildSeamPrompt } from "@/lib/prompts";
import { complete, TOKEN_BUDGETS } from "@/lib/llm";

const isConfigured =
  !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("johndoe") &&
  (!!process.env.VOYAGE_API_KEY || !!process.env.OPENAI_API_KEY) &&
  !(process.env.VOYAGE_API_KEY || "").includes("placeholder") &&
  !!process.env.ANTHROPIC_API_KEY &&
  !process.env.ANTHROPIC_API_KEY.includes("placeholder");

describe.skipIf(!isConfigured)("Seam (Halden Partners corpus)", () => {
  let orgId: string;

  beforeAll(async () => {
    const org = await db.organisation.findUnique({ where: { slug: "halden-partners" } });
    if (!org) throw new Error("Run `npm run seed` before running this test.");
    orgId = org.id;
  });

  it("names the expansion-strategy tension between Mariëlle and Daan", async () => {
    const depositions = await retrieveForQuery(orgId, "expanding to Zurich versus staying a boutique firm", 14);
    const prompt = buildSeamPrompt("expansion strategy and growth", depositions);
    const tension = await complete(prompt, TOKEN_BUDGETS.seam);

    // The Seam should mention both people involved in this planted disagreement.
    expect(tension).toMatch(/Mariëlle Voss|Voss/);
    expect(tension).toMatch(/Daan Kessler|Kessler/);
  }, 30000);

  it("names the risk-tolerance tension in leveraged recommendations", async () => {
    const depositions = await retrieveForQuery(orgId, "how much leverage to recommend to clients", 14);
    const prompt = buildSeamPrompt("risk tolerance in client recommendations", depositions);
    const tension = await complete(prompt, TOKEN_BUDGETS.seam);

    expect(tension).toMatch(/Sophie Lindqvist|Lindqvist/);
  }, 30000);
});
