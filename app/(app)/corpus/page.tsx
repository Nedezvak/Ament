import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";

export default async function CorpusPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
  });

  if (!membership) redirect("/dashboard");

  const depositions = await db.deposition.findMany({
    where: { organisationId: membership.organisationId },
    include: { author: { select: { name: true } }, prompt: { select: { text: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <PageShell
      title="Corpus"
      subtitle={`${depositions.length} deposition${depositions.length !== 1 ? "s" : ""} — the accumulated body of thought.`}
    >
      {depositions.length === 0 ? (
        <p
          className="text-lg"
          style={{
            fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
            fontStyle: "italic",
            color: "#8C8478",
          }}
        >
          The corpus is empty. Begin depositing thought.
        </p>
      ) : (
        <div className="flex flex-col">
          {depositions.map((d, i) => (
            <div
              key={d.id}
              className={`py-5 ${i < depositions.length - 1 ? "border-b border-[#D6CFC0]/60" : ""}`}
            >
              {d.prompt && (
                <p
                  className="text-xs mb-2"
                  style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  In response to: <span style={{ fontStyle: "italic" }}>{d.prompt.text}</span>
                </p>
              )}
              <p
                className="mb-2"
                style={{
                  fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                  fontSize: "1.1rem",
                  lineHeight: "1.7",
                  color: "#1A1816",
                }}
              >
                {d.bodyPlain}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs" style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                  {d.author.name || "Unknown"} · {format(new Date(d.createdAt), "d MMM yyyy")}
                </span>
                {d.isAnchor && <Badge variant="anchor">{d.anchorLabel || "Anchor"}</Badge>}
                {d.themes.map((theme) => (
                  <Badge key={theme} variant="theme">{theme}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
