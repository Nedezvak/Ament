import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PageShell } from "@/components/layout/PageShell";
import { AnchorsClient } from "@/components/lenses/AnchorsClient";
import { format } from "date-fns";

export default async function AnchorsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
  });

  if (!membership) redirect("/dashboard");

  const anchors = await db.deposition.findMany({
    where: { organisationId: membership.organisationId, isAnchor: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell
      title="Anchors"
      subtitle="Marked decisions and commitments — the organisation's decision-memory."
    >
      <AnchorsClient
        anchors={anchors.map((a) => ({
          id: a.id,
          authorName: a.author.name || "Unknown",
          date: a.createdAt.toISOString(),
          anchorLabel: a.anchorLabel,
          excerpt: a.bodyPlain.slice(0, 240),
        }))}
      />
    </PageShell>
  );
}
