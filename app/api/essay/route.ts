import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { retrieveForPeriod } from "@/lib/corpus";
import { buildEssayPrompt } from "@/lib/prompts";
import { complete, TOKEN_BUDGETS } from "@/lib/llm";
import { z } from "zod";

const EssaySchema = z.object({
  period: z.string().regex(/^\d{4}-Q[1-4]$/, "Period must be YYYY-Qn format"),
  forceRegenerate: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const parsed = EssaySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { period, forceRegenerate } = parsed.data;
    const org = membership.organisation;

    // Check for cached essay — don't re-generate unless forced
    if (!forceRegenerate) {
      const cached = await db.essay.findFirst({
        where: { organisationId: org.id, period },
        orderBy: { generatedAt: "desc" },
      });
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    // Retrieve all depositions for this period
    const depositions = await retrieveForPeriod(org.id, period);

    if (depositions.length < 3) {
      return NextResponse.json(
        {
          error: `The corpus holds only ${depositions.length} deposition${depositions.length !== 1 ? "s" : ""} for ${period}. An Essay requires at least 3. Deposit more thought from this period.`,
          depositionCount: depositions.length,
        },
        { status: 422 }
      );
    }

    const prompt = buildEssayPrompt(period, org.name, depositions);
    const essayBody = await complete(prompt, TOKEN_BUDGETS.essay);

    // Generate a title from the first sentence (up to 80 chars)
    const firstSentence = essayBody.split(/[.!?]/)[0].trim();
    const title =
      firstSentence.length > 80
        ? firstSentence.slice(0, 77) + "…"
        : firstSentence;

    const depositionIds = depositions.map((d) => d.id);

    // Cache the essay
    const essay = await db.essay.create({
      data: {
        organisationId: org.id,
        period,
        title: title || `${org.name} — ${period}`,
        body: essayBody,
        depositionIds,
      },
    });

    return NextResponse.json(essay);
  } catch (err) {
    console.error("POST /api/essay error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
      return NextResponse.json({ essays: [] });
    }

    const essays = await db.essay.findMany({
      where: { organisationId: membership.organisationId },
      orderBy: { period: "desc" },
      select: { id: true, period: true, title: true, generatedAt: true, depositionIds: true },
    });

    return NextResponse.json({ essays });
  } catch (err) {
    console.error("GET /api/essay error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
