// ament — seed script
// Recreates the demo organisation "Halden Partners" from scratch.
//
// USAGE:
//   npm run seed
//
// This will:
//  1. Wipe any existing "Halden Partners" organisation (and its data).
//  2. Create the five demo personas as users.
//  3. Seed the global prompt library.
//  4. Create ~60 depositions across two quarters (2025-Q3 and 2025-Q4),
//     embedding each one (requires EMBEDDING_PROVIDER credentials).
//  5. Generate one sample Essay for 2025-Q3.
//
// Embedding ~60 depositions takes a few minutes and makes real API calls
// to your configured embedding provider (Voyage or OpenAI) — small cost,
// see README for estimate. Essay generation makes one Anthropic call.

import { PrismaClient } from "@prisma/client";
import { ORG, PERSONAS, DEPOSITIONS, PersonaKey } from "./data";
import { getGlobalPrompts } from "../../lib/promptLibrary";
import { embed, storeEmbedding, getProvider } from "../../lib/embeddings";
import { retrieveForPeriod } from "../../lib/corpus";
import { buildEssayPrompt } from "../../lib/prompts";
import { complete, TOKEN_BUDGETS } from "../../lib/llm";

const db = new PrismaClient();

function toPeriod(date: Date): string {
  const year = date.getFullYear();
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `${year}-Q${quarter}`;
}

function bodyToHtml(plain: string): string {
  return `<p>${plain.replace(/\n\n/g, "</p><p>")}</p>`;
}

async function main() {
  if (process.env.ALLOW_SEED !== "true" && process.env.NODE_ENV === "production") {
    throw new Error(
      "Refusing to seed: ALLOW_SEED is not 'true' and NODE_ENV is production. " +
      "Set ALLOW_SEED=true in your environment to allow this."
    );
  }

  console.log("ament seed — Halden Partners demo organisation");
  console.log("================================================\n");

  // 1. Remove any existing demo org (cascades to memberships, depositions, etc.)
  const existing = await db.organisation.findUnique({ where: { slug: ORG.slug } });
  if (existing) {
    console.log(`Removing existing organisation "${ORG.name}"...`);
    await db.organisation.delete({ where: { id: existing.id } });
  }

  // 2. Create organisation
  console.log(`Creating organisation "${ORG.name}"...`);
  const org = await db.organisation.create({
    data: { name: ORG.name, slug: ORG.slug, description: ORG.description },
  });

  // 3. Create personas as users + memberships
  console.log("Creating personas...");
  const userIds: Record<PersonaKey, string> = {} as Record<PersonaKey, string>;
  for (const [key, persona] of Object.entries(PERSONAS) as [PersonaKey, typeof PERSONAS[PersonaKey]][]) {
    const user = await db.user.upsert({
      where: { email: persona.email },
      update: { name: persona.name },
      create: { name: persona.name, email: persona.email },
    });
    userIds[key] = user.id;

    await db.membership.upsert({
      where: { userId_organisationId: { userId: user.id, organisationId: org.id } },
      update: { role: persona.role },
      create: { userId: user.id, organisationId: org.id, role: persona.role },
    });
    console.log(`  - ${persona.name} (${persona.role})`);
  }

  // 4. Seed global prompts
  console.log("\nSeeding prompt library...");
  const libraryPrompts = getGlobalPrompts();
  await db.prompt.createMany({
    data: libraryPrompts.map((p) => ({
      organisationId: org.id,
      text: p.text,
      category: p.category,
    })),
  });
  const allPrompts = await db.prompt.findMany({ where: { organisationId: org.id } });
  console.log(`  - ${allPrompts.length} prompts seeded`);

  // 5. Create depositions + embeddings
  console.log(`\nCreating ${DEPOSITIONS.length} depositions...`);
  console.log(`  Embedding provider: ${getProvider()}`);

  let count = 0;
  for (const dep of DEPOSITIONS) {
    const date = new Date(dep.date + "T10:00:00Z");
    const period = toPeriod(date);

    // Find a matching prompt for this category (if any)
    let promptId: string | undefined;
    if (dep.category) {
      const candidates = allPrompts.filter((p) => p.category === dep.category);
      if (candidates.length > 0) {
        promptId = candidates[count % candidates.length].id;
      }
    }

    const deposition = await db.deposition.create({
      data: {
        organisationId: org.id,
        authorId: userIds[dep.author],
        promptId: promptId || null,
        body: bodyToHtml(dep.body),
        bodyPlain: dep.body,
        isAnchor: dep.isAnchor || false,
        anchorLabel: dep.anchorLabel || null,
        period,
        createdAt: date,
        updatedAt: date,
        themes: [], // populated below via theme extraction (best-effort)
      },
    });

    // Embed
    try {
      const vector = await embed(dep.body);
      const model = getProvider() === "voyage"
        ? (process.env.VOYAGE_MODEL || "voyage-3")
        : (process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small");
      await storeEmbedding(db, deposition.id, vector, model);
    } catch (err) {
      console.warn(`  ! Embedding failed for deposition ${deposition.id}: ${err instanceof Error ? err.message : err}`);
    }

    count++;
    if (count % 10 === 0) {
      console.log(`  ... ${count}/${DEPOSITIONS.length}`);
    }
  }
  console.log(`  - ${count} depositions created and embedded`);

  // 6. Generate sample Essay for 2025-Q3
  console.log("\nGenerating sample Essay for 2025-Q3...");
  try {
    const period = "2025-Q3";
    const depositions = await retrieveForPeriod(org.id, period);
    const prompt = buildEssayPrompt(period, org.name, depositions);
    const essayBody = await complete(prompt, TOKEN_BUDGETS.essay);

    const firstSentence = essayBody.split(/[.!?]/)[0].trim();
    const title = firstSentence.length > 80 ? firstSentence.slice(0, 77) + "…" : firstSentence;

    await db.essay.create({
      data: {
        organisationId: org.id,
        period,
        title: title || `${org.name} — ${period}`,
        body: essayBody,
        depositionIds: depositions.map((d) => d.id),
      },
    });
    console.log(`  - Essay generated: "${title}"`);
  } catch (err) {
    console.warn(`  ! Essay generation failed: ${err instanceof Error ? err.message : err}`);
    console.warn("    You can generate it later from the Essay page in the app.");
  }

  console.log("\n================================================");
  console.log("Seed complete.");
  console.log(`\nTo sign in as a demo persona in development, use the dev login`);
  console.log(`with one of these emails:`);
  for (const persona of Object.values(PERSONAS)) {
    console.log(`  - ${persona.email}`);
  }
}

main()
  .catch((err) => {
    console.error("\nSeed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
