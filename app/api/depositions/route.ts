import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { embed, storeEmbedding, getProvider } from "@/lib/embeddings";
import { complete, TOKEN_BUDGETS } from "@/lib/llm";
import { buildThemeExtractionPrompt } from "@/lib/prompts";
import { toPeriod } from "@/lib/corpus";
import { z } from "zod";

const CreateDepositionSchema = z.object({
  body: z.string().min(1, "Body is required"),
  bodyPlain: z.string().min(1),
  promptId: z.string().optional(),
  isAnchor: z.boolean().optional().default(false),
  anchorLabel: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Get the user's primary organisation
    const membership = await db.membership.findFirst({
      where: { userId: session.user.id },
      orderBy: { joinedAt: "asc" },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organisation membership found" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateDepositionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const now = new Date();
    const period = toPeriod(now);

    // 1. Extract themes via LLM (non-blocking intent — run in parallel with embedding)
    let themes: string[] = [];
    try {
      const themePrompt = buildThemeExtractionPrompt(data.bodyPlain);
      const themeRaw = await complete(themePrompt, TOKEN_BUDGETS.themeExtraction);
      const cleaned = themeRaw.trim().replace(/^```json?\s*/i, "").replace(/\s*```$/, "");
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        themes = parsed.slice(0, 5).map(String);
      }
    } catch {
      // Theme extraction failure is non-critical; deposition saves without themes
    }

    // 2. Create the deposition
    const deposition = await db.deposition.create({
      data: {
        organisationId: membership.organisationId,
        authorId: session.user.id,
        promptId: data.promptId || null,
        body: data.body,
        bodyPlain: data.bodyPlain,
        themes,
        isAnchor: data.isAnchor,
        anchorLabel: data.anchorLabel || null,
        period,
      },
    });

    // 3. Embed and store (fire-and-forget — client gets immediate response)
    embedDepositionAsync(deposition.id, data.bodyPlain).catch((err) => {
      console.error(`Embedding failed for deposition ${deposition.id}:`, err);
    });

    return NextResponse.json(deposition, { status: 201 });
  } catch (err) {
    console.error("POST /api/depositions error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function embedDepositionAsync(depositionId: string, text: string) {
  const vector = await embed(text);
  const model = getProvider() === "voyage"
    ? (process.env.VOYAGE_MODEL || "voyage-3")
    : (process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small");
  await storeEmbedding(db, depositionId, vector, model);
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
      return NextResponse.json({ depositions: [] });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period");
    const anchor = searchParams.get("anchor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const depositions = await db.deposition.findMany({
      where: {
        organisationId: membership.organisationId,
        ...(period ? { period } : {}),
        ...(anchor === "true" ? { isAnchor: true } : {}),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        prompt: { select: { id: true, text: true, category: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ depositions });
  } catch (err) {
    console.error("GET /api/depositions error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
