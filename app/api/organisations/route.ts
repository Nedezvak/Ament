import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getGlobalPrompts } from "@/lib/promptLibrary";
import { z } from "zod";

const CreateOrgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
});

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateOrgSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, description } = parsed.data;
    let slug = toSlug(name);

    // Ensure slug uniqueness
    const existing = await db.organisation.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Create org, membership, and seed global prompts in one transaction
    const org = await db.$transaction(async (tx) => {
      const org = await tx.organisation.create({
        data: { name, slug, description },
      });

      await tx.membership.create({
        data: {
          userId: session.user!.id!,
          organisationId: org.id,
          role: "ADMIN",
        },
      });

      // Seed global prompts
      const prompts = getGlobalPrompts();
      await tx.prompt.createMany({
        data: prompts.map((p) => ({
          organisationId: org.id,
          text: p.text,
          category: p.category,
        })),
      });

      return org;
    });

    return NextResponse.json(org, { status: 201 });
  } catch (err) {
    console.error("POST /api/organisations error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
