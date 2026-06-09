"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";

interface Anchor {
  id: string;
  authorName: string;
  date: string;
  anchorLabel: string | null;
  excerpt: string;
}

interface AnchorsClientProps {
  anchors: Anchor[];
}

interface DecisionMemoryResult {
  answer: string;
  citedDepositionIds: string[];
  error?: string;
}

export function AnchorsClient({ anchors }: AnchorsClientProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DecisionMemoryResult | null>(null);
  const [error, setError] = useState("");

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/anchors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Query failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Decision-memory query */}
      <div className="border border-[#D6CFC0] rounded-sm px-6 py-5">
        <p
          className="text-sm font-medium mb-3"
          style={{ color: "#1A1816", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          Ask why a decision was made
        </p>
        <form onSubmit={handleAsk} className="flex flex-col gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Why did we decide to…"
            className="w-full px-4 py-3 border border-[#D6CFC0] rounded bg-transparent focus:border-[#8C8478] focus:outline-none"
            style={{
              fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
              fontSize: "1.05rem",
              color: "#1A1816",
            }}
          />
          <div>
            <Button type="submit" size="sm" loading={loading} disabled={!question.trim()}>
              Ask decision-memory
            </Button>
          </div>
        </form>

        {error && (
          <p className="text-sm mt-3" style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
            {error}
          </p>
        )}

        {result && (
          <div className="mt-5 pt-5 border-t border-[#D6CFC0] prose-ament" style={{ fontSize: "1.05rem" }}>
            {result.answer.split(/\n\n+/).map((para, i) => (
              <p key={i}>
                {para.split(/(\[[^\]]+\])/g).map((part, j) =>
                  part.match(/^\[[^\]]+\]$/) ? (
                    <span key={j} style={{ color: "#9C4221", fontStyle: "italic" }}>{part}</span>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* List of anchors */}
      <div>
        <p
          className="text-xs uppercase tracking-wider mb-4"
          style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          {anchors.length} marked decision{anchors.length !== 1 ? "s" : ""}
        </p>

        {anchors.length === 0 ? (
          <p
            className="text-sm"
            style={{
              color: "#8C8478",
              fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
              fontStyle: "italic",
            }}
          >
            No decisions have been marked as Anchors yet. Mark a deposition as an Anchor when depositing.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {anchors.map((a) => (
              <div key={a.id} className="border border-[#D6CFC0] rounded-sm px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="anchor">Anchor</Badge>
                  <span className="text-xs" style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                    {a.authorName} · {format(new Date(a.date), "d MMM yyyy")}
                  </span>
                </div>
                {a.anchorLabel && (
                  <p
                    className="text-base mb-1"
                    style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", color: "#1A1816" }}
                  >
                    {a.anchorLabel}
                  </p>
                )}
                <p
                  className="text-sm"
                  style={{
                    color: "#8C8478",
                    fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                    fontStyle: "italic",
                  }}
                >
                  {a.excerpt}{a.excerpt.length >= 240 ? "…" : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
