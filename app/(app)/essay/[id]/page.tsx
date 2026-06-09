import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";

export default async function EssayDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const essay = await db.essay.findUnique({
    where: { id: params.id },
    include: { organisation: true },
  });

  if (!essay) notFound();

  // Auth check — user must belong to this org
  const membership = await db.membership.findFirst({
    where: { userId: session.user.id, organisationId: essay.organisationId },
  });
  if (!membership) notFound();

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F4EFE4" }}
    >
      {/* Minimal essay header */}
      <div
        className="border-b border-[#D6CFC0] px-6 py-4 flex items-center justify-between"
        style={{ maxWidth: "none" }}
      >
        <Link
          href="/essay"
          className="text-sm"
          style={{
            color: "#8C8478",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            textDecoration: "none",
          }}
        >
          ← Essays
        </Link>
        <div
          className="text-xs"
          style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          {essay.period} · {essay.organisation.name}
        </div>
      </div>

      {/* Essay body — generous reading layout */}
      <article
        className="mx-auto px-6 py-16 md:py-24"
        style={{ maxWidth: "740px" }}
      >
        {/* Period label */}
        <div
          className="text-xs uppercase tracking-widest mb-8"
          style={{
            color: "#9C4221",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            letterSpacing: "0.12em",
          }}
        >
          {essay.period}
        </div>

        {/* Title */}
        <h1
          className="mb-2"
          style={{
            fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
            fontSize: "2.4rem",
            fontWeight: 400,
            lineHeight: 1.2,
            color: "#1A1816",
            letterSpacing: "-0.02em",
          }}
        >
          {essay.title}
        </h1>

        {/* Meta */}
        <p
          className="mb-12"
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "0.8rem",
            color: "#8C8478",
          }}
        >
          {essay.organisation.name} · Generated {format(new Date(essay.generatedAt), "d MMMM yyyy")}
          {" "}· {essay.depositionIds.length} deposition{essay.depositionIds.length !== 1 ? "s" : ""} cited
        </p>

        {/* Ruling line */}
        <div
          className="mb-12"
          style={{ borderTop: "1px solid #D6CFC0", width: "4rem" }}
        />

        {/* Essay body */}
        <div className="prose-ament">
          <EssayBody text={essay.body} />
        </div>

        {/* Footer */}
        <div
          className="mt-16 pt-8"
          style={{ borderTop: "1px solid #D6CFC0" }}
        >
          <p
            className="text-xs"
            style={{
              color: "#8C8478",
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
          >
            This essay was synthesised from the corpus of {essay.organisation.name} for the period {essay.period}.
            Citations in{" "}
            <span style={{ color: "#9C4221" }}>Siena</span> refer to depositions in the corpus.
          </p>
        </div>
      </article>
    </div>
  );
}

// Render essay text, highlighting [Author, date] citations in Siena
function EssayBody({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <>
      {paragraphs.map((para, i) => {
        const parts = para.split(/(\[[^\]]+\])/g);
        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (part.match(/^\[[^\]]+\]$/)) {
                return (
                  <span
                    key={j}
                    className="citation"
                    style={{ color: "#9C4221", fontStyle: "italic", fontSize: "0.9em" }}
                  >
                    {part}
                  </span>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </>
  );
}
