"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface InheritanceResponse {
  briefing: string;
  depositionCount: number;
  anchorCount: number;
  error?: string;
}

export function InheritanceClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InheritanceResponse | null>(null);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/inheritance");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!result && !loading && !error) {
    return (
      <div className="py-12 text-center">
        <p
          className="text-lg mb-6"
          style={{
            fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
            fontStyle: "italic",
            color: "#8C8478",
            lineHeight: "1.7",
          }}
        >
          Generate a briefing on what this organisation believes, how it reasons,
          and what it has decided — written for someone arriving for the first time.
        </p>
        <Button onClick={generate}>Generate Inheritance briefing</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
            Reading the corpus and drafting the briefing…
          </span>
        </div>
      )}

      {error && (
        <p className="text-sm" style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
          {error}
        </p>
      )}

      {result && !loading && (
        <>
          <div className="flex items-center gap-3 pb-4 border-b border-[#D6CFC0]">
            <span className="text-xs" style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
              Drawn from {result.depositionCount} deposition{result.depositionCount !== 1 ? "s" : ""}
              {result.anchorCount > 0 ? ` and ${result.anchorCount} anchored decision${result.anchorCount !== 1 ? "s" : ""}` : ""}
            </span>
            <Button size="sm" variant="ghost" onClick={generate} loading={loading}>
              Regenerate
            </Button>
          </div>

          <div className="prose-ament">
            <BriefingBody text={result.briefing} />
          </div>
        </>
      )}
    </div>
  );
}

function BriefingBody({ text }: { text: string }) {
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
