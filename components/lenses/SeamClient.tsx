"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface SeamResponse {
  tension: string;
  hasGenuineTension: boolean;
  citedDepositionIds: string[];
  error?: string;
}

const SUGGESTED_TOPICS = [
  "risk tolerance and caution",
  "pace of growth versus quality",
  "the role of process and structure",
  "hiring standards and team culture",
  "how we make decisions",
];

export function SeamClient() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeamResponse | null>(null);
  const [error, setError] = useState("");

  async function handleQuery(t: string) {
    const trimmed = t.trim();
    if (!trimmed) return;

    setTopic(trimmed);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/seam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seam query failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleQuery(topic);
        }}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic, e.g. 'risk appetite' or 'hiring philosophy'"
          className="w-full px-4 py-3 border border-[#D6CFC0] rounded bg-transparent focus:border-[#8C8478] focus:outline-none"
          style={{
            fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
            fontSize: "1.1rem",
            color: "#1A1816",
          }}
        />
        <Button type="submit" loading={loading} disabled={!topic.trim()}>
          Read the Seam
        </Button>
      </form>

      {!result && !loading && (
        <div>
          <p
            className="text-xs mb-3 uppercase tracking-wider"
            style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Suggested topics
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleQuery(t)}
                className="text-sm px-3 py-1.5 border border-[#D6CFC0] rounded hover:border-[#8C8478] transition-colors"
                style={{
                  color: "#8C8478",
                  fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-8">
          <div className="w-4 h-4 border border-[#8C8478] border-t-transparent rounded-full animate-spin" />
          <span
            className="text-sm"
            style={{
              color: "#8C8478",
              fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
              fontStyle: "italic",
            }}
          >
            Reading the seam…
          </span>
        </div>
      )}

      {error && (
        <p className="text-sm" style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
          {error}
        </p>
      )}

      {result && !loading && (
        <div className="border-t border-[#D6CFC0] pt-8">
          <p
            className="text-xs uppercase tracking-wider mb-4"
            style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {result.hasGenuineTension ? "A tension exists" : "No tension found"}
          </p>

          <div
            className={`${result.hasGenuineTension ? "border-l-2 border-[#9C4221] pl-5" : ""}`}
          >
            <p
              className="text-lg leading-relaxed"
              style={{
                fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                color: "#1A1816",
                lineHeight: "1.8",
              }}
            >
              {result.tension.split(/(\[[^\]]+\])/).map((part, i) => {
                if (part.match(/^\[[^\]]+\]$/)) {
                  return (
                    <span key={i} style={{ color: "#9C4221", fontStyle: "italic" }}>
                      {part}
                    </span>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setResult(null);
              setTopic("");
            }}
            className="mt-8 text-sm"
            style={{
              color: "#9C4221",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              textUnderlineOffset: "3px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Explore another topic
          </button>
        </div>
      )}
    </div>
  );
}
