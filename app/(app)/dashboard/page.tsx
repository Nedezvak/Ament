import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { organisation: { include: { _count: { select: { depositions: true, essays: true } } } } },
  });

  if (!membership) {
    // No org yet — show onboarding
    return (
      <PageShell>
        <div className="max-w-xl mx-auto text-center py-24">
          <h1
            className="text-3xl font-normal mb-4"
            style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", color: "#1A1816" }}
          >
            Welcome to ament.
          </h1>
          <p className="text-sm mb-8" style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
            You are not yet a member of any organisation. Ask your administrator to invite you,
            or start a new organisation below.
          </p>
          <Link
            href="/settings/organisation/new"
            className="inline-flex items-center px-5 py-2.5 rounded bg-[#1A1816] text-[#F4EFE4] text-sm hover:bg-[#2d2a27] transition-colors"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif", textDecoration: "none" }}
          >
            Start an organisation
          </Link>
        </div>
      </PageShell>
    );
  }

  const org = membership.organisation;

  // Recent depositions
  const recentDepositions = await db.deposition.findMany({
    where: { organisationId: org.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { author: { select: { name: true } } },
  });

  // Anchors count
  const anchorsCount = await db.deposition.count({
    where: { organisationId: org.id, isAnchor: true },
  });

  // Available periods for essays
  const periods = await db.deposition.groupBy({
    by: ["period"],
    where: { organisationId: org.id, period: { not: null } },
    _count: true,
    orderBy: { period: "desc" },
    take: 4,
  });

  return (
    <PageShell
      title={org.name}
      subtitle={`A living corpus of ${org._count.depositions} deposition${org._count.depositions !== 1 ? "s" : ""}.`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Depositions"
          value={org._count.depositions}
          href="/corpus"
        />
        <StatCard
          label="Anchors"
          value={anchorsCount}
          href="/anchors"
        />
        <StatCard
          label="Essays"
          value={org._count.essays}
          href="/essay"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent depositions */}
        <Card>
          <div className="px-5 py-4 border-b border-[#D6CFC0] flex items-center justify-between">
            <h2
              className="text-base font-normal"
              style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif" }}
            >
              Recent depositions
            </h2>
            <Link
              href="/deposit"
              className="text-xs px-3 py-1.5 rounded border border-[#D6CFC0] hover:border-[#8C8478] transition-colors"
              style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif", textDecoration: "none" }}
            >
              + Deposit
            </Link>
          </div>
          <CardBody className="!p-0">
            {recentDepositions.length === 0 ? (
              <p className="px-5 py-8 text-sm text-center" style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                The corpus is empty. Begin depositing thought.
              </p>
            ) : (
              <ul>
                {recentDepositions.map((d, i) => (
                  <li
                    key={d.id}
                    className={`px-5 py-3.5 ${i < recentDepositions.length - 1 ? "border-b border-[#D6CFC0]/60" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm leading-snug line-clamp-2"
                          style={{ color: "#1A1816", fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", fontStyle: "italic" }}
                        >
                          {d.bodyPlain.slice(0, 120)}{d.bodyPlain.length > 120 ? "…" : ""}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs" style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                            {d.author.name || "Unknown"} · {format(new Date(d.createdAt), "d MMM yyyy")}
                          </span>
                          {d.isAnchor && <Badge variant="anchor">Anchor</Badge>}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Lenses */}
        <div className="flex flex-col gap-4">
          <LensCard
            href="/mirror"
            title="Mirror"
            description="Ask the organisation a question. Get a cited, synthesised answer drawn from its corpus."
          />
          <LensCard
            href="/seam"
            title="Seam"
            description="Surface where genuine tension or disagreement lives inside the corpus. Named, not resolved."
          />
          <LensCard
            href="/essay"
            title="Essay"
            description="A literary synthesis of a period's depositions — the organisation's reflection on itself."
          />
          <LensCard
            href="/inheritance"
            title="Inheritance"
            description="What this organisation believes. A briefing for the newly arrived."
          />
        </div>
      </div>
    </PageShell>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className="border border-[#D6CFC0] rounded-sm px-5 py-4 hover:border-[#8C8478] transition-colors">
        <div
          className="text-3xl font-normal"
          style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", color: "#1A1816" }}
        >
          {value}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          {label}
        </div>
      </div>
    </Link>
  );
}

function LensCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className="border border-[#D6CFC0] rounded-sm px-5 py-4 hover:border-[#8C8478] transition-colors group">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-sm font-medium"
            style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {title}
          </span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
