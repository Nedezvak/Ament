// Smoke test: Essay generation produces a substantial, cited essay for a
// period with depositions in the seeded "Halden Partners" corpus.
//
// REQUIRES: a seeded database, EMBEDDING_PROVIDER and ANTHROPIC_API_KEY
// credentials. Skipped automatically if these are not configured.
// This test makes one Anthropic API call (~$0.03-0.05).

import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/lib/db";
import { retrieveForPeriod } from "@/lib/corpus";
import { buildEssayPrompt } from "@/lib/prompts";
import { complete, TOKEN_BUDGETS } from "@/lib/llm";

const isConfigured =
  !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("johndoe") &&
  (!!process.env.VOYAGE_API_KEY || !!process.env.OPENAI_API_KEY) &&
  !(process.env.VOYAGE_API_KEY || "").includes("placeholder") &&
  !!process.env.ANTHROPIC_API_KEY &&
  !process.env.ANTHROPIC_API_KEY.includes("placeholder");

describe.skipIf(!isConfigured)("Essay generation (Halden Partners corpus)", () => {
  let orgId: string;
  let orgName: string;

  beforeAll(async () => {
    const org = await db.organisation.findUnique({ where: { slug: "halden-partners" } });
    if (!org) throw new Error("Run `npm run seed` before running this test.");
    orgId = org.id;
    orgName = org.name;
  });

  it("generates a literary essay of substantial length for 2025-Q4", async () => {
    const depositions = await retrieveForPeriod(orgId, "2025-Q4");
    expect(depositions.length).toBeGreaterThanOrEqual(3);

    const prompt = buildEssayPrompt("2025-Q4", orgName, depositions);
    const essay = await complete(prompt, TOKEN_BUDGETS.essay);

    const wordCount = essay.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThan(400); // allow some flexibility below the 800-1500 target

    // Should cite at least one deposition author
    const authors = depositions.map((d) => d.author);
    const citesSomeone = authors.some((author) => essay.includes(author));
    expect(citesSomeone).toBe(true);
  }, 60000);
});
