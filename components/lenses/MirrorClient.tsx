"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface MirrorResponse {
  answer: string;
  citedDepositionIds: string[];
  isCorpusThin: boolean;
  error?: string;
}

// Suggested questions to help users get started
const SUGGESTED_QUESTIONS = [
  "What does this organisation believe about its competitive advantage?",
  "Where is there disagreement about strategy?",
  "How does this organisation think about risk?",
  "What are the most important decisions we have made?",
  "What does this organisation value above all else?",
];

export function MirrorClient() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MirrorResponse | null>(null);
  const [error, setError] = useState("");

  async function handleAsk(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;

    setQuestion(trimmed);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Mirror query failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await handleAsk(question);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Query form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What does the organisation believe about…"
          rows={3}
          className="w-full px-4 py-3 border border-[#D6CFC0] rounded bg-transparent focus:border-[#8C8478] focus:outline-none resize-none"
          style={{
            fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
            fontSize: "1.1rem",
            color: "#1A1816",
            lineHeight: "1.6",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleAsk(question);
            }
          }}
        />
        <div className="flex items-center gap-3">
          <Button type="submit" loading={loading} disabled={!question.trim()}>
            Ask the Mirror
          </Button>
          <span
            className="text-xs hidden sm:block"
            style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            ⌘↵ to submit
          </span>
        </div>
      </form>

      {/* Suggested questions */}
      {!result && !loading && (
        <div>
          <p
            className="text-xs mb-3 uppercase tracking-wider"
            style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Suggested questions
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleAsk(q)}
                className="text-sm px-3 py-1.5 border border-[#D6CFC0] rounded hover:border-[#8C8478] transition-colors text-left"
                style={{
                  color: "#8C8478",
                  fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 py-8">
          <div
            className="w-4 h-4 border border-[#8C8478] border-t-transparent rounded-full animate-spin"
          />
          <span
            className="text-sm"
            style={{ color: "#8C8478", fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", fontStyle: "italic" }}
          >
            The Mirror is reading the corpus…
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p
          className="text-sm"
          style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          {error}
        </p>
      )}

      {/* Answer */}
      {result && !loading && (
        <div className="border-t border-[#D6CFC0] pt-8">
          <div className="mb-4">
            <p
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              The corpus responds
            </p>
            <p
              className="text-base"
              style={{
                fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                fontStyle: "italic",
                color: "#1A1816",
              }}
            >
              {question}
            </p>
          </div>

          {result.isCorpusThin && (
            <div
              className="corpus-thin-notice mb-6"
              style={{
                fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                fontStyle: "italic",
                color: "#8C8478",
                borderLeft: "2px solid #D6CFC0",
                paddingLeft: "1rem",
              }}
            >
              The corpus is thin on this topic. The answer below reflects limited material.
            </div>
          )}

          <div className="prose-ament">
            <AnswerWithCitations text={result.answer} />
          </div>

          {/* Ask another */}
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setQuestion("");
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
            Ask another question
          </button>
        </div>
      )}
    </div>
  );
}

// Render the answer, styling [Author, date] citations in Siena
function AnswerWithCitations({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.match(/^\[[^\]]+\]$/)) {
          return (
            <span
              key={i}
              className="citation"
              style={{
                color: "#9C4221",
                fontStyle: "italic",
                fontSize: "0.9em",
              }}
            >
              {part}
            </span>
          );
        }
        // Render paragraphs
        return part.split("\n\n").map((para, j) => (
          <p key={`${i}-${j}`} style={{ marginBottom: "1.4em" }}>
            {para}
          </p>
        ));
      })}
    </>
  );
}
