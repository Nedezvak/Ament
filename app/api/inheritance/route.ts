import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { retrieveAnchors, retrieveCorpusSample } from "@/lib/corpus";
import { buildInheritancePrompt } from "@/lib/prompts";
import { complete, TOKEN_BUDGETS } from "@/lib/llm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const membership = await db.membership.findFirst({
      where: { userId: session.user.id },
      include: { organisation: true },
      orderBy: { joinedAt: "asc" },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organisation membership found" }, { status: 403 });
    }

    const org = membership.organisation;

    const [sample, anchors] = await Promise.all([
      retrieveCorpusSample(org.id, 30),
      retrieveAnchors(org.id),
    ]);

    if (sample.length === 0) {
      return NextResponse.json({
        briefing:
          "The corpus is empty. The Inheritance briefing cannot be generated until the organisation begins depositing thought.",
        depositionCount: 0,
        anchorCount: 0,
      });
    }

    const prompt = buildInheritancePrompt(org.name, sample, anchors);
    const briefing = await complete(prompt, TOKEN_BUDGETS.inheritance);

    return NextResponse.json({
      briefing,
      depositionCount: sample.length,
      anchorCount: anchors.length,
    });
  } catch (err) {
    console.error("GET /api/inheritance error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
