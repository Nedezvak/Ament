import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { retrieveForQuery } from "@/lib/corpus";
import { buildSeamPrompt } from "@/lib/prompts";
import { complete, TOKEN_BUDGETS } from "@/lib/llm";
import { z } from "zod";

const SeamSchema = z.object({
  topic: z.string().min(3, "Topic is required").max(300),
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
    const parsed = SeamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { topic } = parsed.data;
    const orgId = membership.organisationId;

    const corpusSize = await db.deposition.count({ where: { organisationId: orgId } });
    if (corpusSize < 5) {
      return NextResponse.json({
        tension:
          "The corpus is too thin to detect tension. Deposit more thought before reading the Seam.",
        hasGenuineTension: false,
        citedDepositionIds: [],
      });
    }

    // Retrieve more depositions for Seam — we need breadth to find divergence
    const depositions = await retrieveForQuery(orgId, topic, 14);

    const prompt = buildSeamPrompt(topic, depositions);
    const tension = await complete(prompt, TOKEN_BUDGETS.seam);

    const hasGenuineTension =
      tension.toLowerCase().includes("disagree") ||
      tension.toLowerCase().includes("tension") ||
      tension.toLowerCase().includes("diverge") ||
      tension.toLowerCase().includes("contrast") ||
      tension.toLowerCase().includes("whereas") ||
      tension.toLowerCase().includes("while") ||
      (tension.includes("[") && tension.includes("]"));

    const citedDepositionIds = depositions
      .filter((d) => tension.includes(d.author))
      .map((d) => d.id);

    return NextResponse.json({
      tension,
      hasGenuineTension,
      citedDepositionIds,
    });
  } catch (err) {
    console.error("POST /api/seam error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
