import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { retrieveForQuery } from "@/lib/corpus";
import { buildMirrorPrompt } from "@/lib/prompts";
import { complete, TOKEN_BUDGETS } from "@/lib/llm";
import { checkCitations } from "@/lib/citations";
import { z } from "zod";

const MirrorSchema = z.object({
  question: z.string().min(3, "Question is required").max(500),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const membership = await db.membership.findFirst({
      where: { userId: session.user.id },
      orderBy: { joinedAt: "asc" },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organisation membership found" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = MirrorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { question } = parsed.data;
    const orgId = membership.organisationId;

    // Check corpus size first
    const corpusSize = await db.deposition.count({ where: { organisationId: orgId } });
    if (corpusSize === 0) {
      return NextResponse.json({
        answer: "The corpus holds nothing yet. Ask your members to begin depositing thought.",
        citedDepositionIds: [],
        isCorpusThin: true,
      });
    }

    // Retrieve relevant depositions (top 10, hard-capped at 20 inside retrieveForQuery)
    const depositions = await retrieveForQuery(orgId, question, 10);

    const isCorpusThin = depositions.length < 3;

    // Build and run the Mirror prompt
    const prompt = buildMirrorPrompt(question, depositions);
    const answer = await complete(prompt, TOKEN_BUDGETS.mirror);

    // Citation integrity check: confirm cited authors were actually retrieved.
    const { citedDepositionIds, hasUnverifiedCitation } = checkCitations(answer, depositions);
    if (hasUnverifiedCitation) {
      console.warn(`Mirror produced an unverified citation for question: "${question}"`);
    }

    return NextResponse.json({
      answer,
      citedDepositionIds,
      isCorpusThin,
    });
  } catch (err) {
    console.error("POST /api/mirror error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
