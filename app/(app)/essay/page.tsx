import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PageShell } from "@/components/layout/PageShell";
import { EssayListClient } from "@/components/lenses/EssayListClient";
import { format } from "date-fns";

export default async function EssayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
  });

  if (!membership) redirect("/dashboard");

  // Get available periods with deposition counts
  const periods = await db.deposition.groupBy({
    by: ["period"],
    where: { organisationId: membership.organisationId, period: { not: null } },
    _count: { id: true },
    orderBy: { period: "desc" },
  });

  // Get existing essays
  const essays = await db.essay.findMany({
    where: { organisationId: membership.organisationId },
    orderBy: { period: "desc" },
    select: { id: true, period: true, title: true, generatedAt: true },
  });

  const essayMap = new Map(
    essays.map((e) => [e.period, { ...e, generatedAt: e.generatedAt.toISOString() }])
  );

  return (
    <PageShell
      title="Essay"
      subtitle="A literary synthesis of a period's depositions."
    >
      <EssayListClient
        periods={periods
          .filter((p) => p.period !== null)
          .map((p) => ({
            period: p.period!,
            depositionCount: p._count.id,
            essay: essayMap.get(p.period!) || null,
          }))}
      />
    </PageShell>
  );
}
