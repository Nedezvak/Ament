// Integration test: retrieval returns relevant depositions from the seeded
// "Halden Partners" corpus.
//
// REQUIRES: a configured DATABASE_URL pointing at a database that has been
// seeded (`npm run seed`), plus EMBEDDING_PROVIDER credentials.
// Skipped automatically if these are not configured — see README "Tests".

import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/lib/db";
import { retrieveForQuery } from "@/lib/corpus";

const isConfigured =
  !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("johndoe") && // skip the placeholder dev value
  (!!process.env.VOYAGE_API_KEY || !!process.env.OPENAI_API_KEY) &&
  !(process.env.VOYAGE_API_KEY || "").includes("placeholder");

describe.skipIf(!isConfigured)("retrieveForQuery (Halden Partners corpus)", () => {
  let orgId: string;

  beforeAll(async () => {
    const org = await db.organisation.findUnique({ where: { slug: "halden-partners" } });
    if (!org) throw new Error("Run `npm run seed` before running this test.");
    orgId = org.id;
  });

  it("returns depositions relevant to a leverage/risk query", async () => {
    const results = await retrieveForQuery(orgId, "leverage and risk in client recommendations", 10);
    expect(results.length).toBeGreaterThan(0);

    // At least one result should be authored by Sophie Lindqvist, who
    // raised the risk-framework thread in the seed data.
    const authors = results.map((r) => r.author);
    expect(authors).toContain("Sophie Lindqvist");
  });

  it("respects the top-k cap of 20", async () => {
    const results = await retrieveForQuery(orgId, "the organisation", 50);
    expect(results.length).toBeLessThanOrEqual(20);
  });
});
