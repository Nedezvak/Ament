import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { retrieveForQuery } from "@/lib/corpus";
import { buildDecisionMemoryPrompt } from "@/lib/prompts";
import { complete, TOKEN_BUDGETS } from "@/lib/llm";
import { z } from "zod";

const DecisionMemorySchema = z.object({
  question: z.string().min(3).max(500),
});

// GET — list all anchors
export async function GET(req: NextRequest) {
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
      return NextResponse.json({ anchors: [] });
    }

    const anchors = await db.deposition.findMany({
      where: { organisationId: membership.organisationId, isAnchor: true },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ anchors });
  } catch (err) {
    console.error("GET /api/anchors error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — query decision memory
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
    const parsed = DecisionMemorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { question } = parsed.data;
    const orgId = membership.organisationId;

    // Retrieve relevant anchors and surrounding depositions
    const [allAnchors, surrounding] = await Promise.all([
      db.deposition.findMany({
        where: { organisationId: orgId, isAnchor: true },
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      retrieveForQuery(orgId, question, 8),
    ]);

    const anchorCited = allAnchors
      .filter((a) => {
        const ql = question.toLowerCase();
        const labelMatch = a.anchorLabel?.toLowerCase().includes(ql.split(" ")[0]) ?? false;
        return labelMatch;
      })
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        author: a.author.name || "Unknown",
        date: a.createdAt.toISOString(),
        excerpt: a.bodyPlain.slice(0, 600),
        isAnchor: true,
        anchorLabel: a.anchorLabel || undefined,
      }));

    // If no label-match found, use similarity search results that are anchors
    const anchorIds = new Set(allAnchors.map((a) => a.id));
    const anchorFromSimilarity = surrounding
      .filter((d) => anchorIds.has(d.id))
      .slice(0, 5);

    const anchorsForPrompt = anchorCited.length > 0 ? anchorCited : anchorFromSimilarity;
    const surroundingForPrompt = surrounding.filter((d) => !anchorIds.has(d.id));

    const prompt = buildDecisionMemoryPrompt(question, anchorsForPrompt, surroundingForPrompt);
    const answer = await complete(prompt, TOKEN_BUDGETS.decisionMemory);

    return NextResponse.json({
      answer,
      citedDepositionIds: [...anchorsForPrompt, ...surroundingForPrompt]
        .filter((d) => answer.includes(d.author))
        .map((d) => d.id),
    });
  } catch (err) {
    console.error("POST /api/anchors error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
