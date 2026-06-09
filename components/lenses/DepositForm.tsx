"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Prompt {
  id: string;
  text: string;
  category: string | null;
}

interface DepositFormProps {
  prompts: Prompt[];
}

export function DepositForm({ prompts }: DepositFormProps) {
  const router = useRouter();
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [bodyText, setBodyText] = useState("");
  const [isAnchor, setIsAnchor] = useState(false);
  const [anchorLabel, setAnchorLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);

  const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bodyText.trim()) {
      setError("Please write something before depositing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/depositions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: `<p>${bodyText.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`,
          bodyPlain: bodyText,
          promptId: selectedPromptId || undefined,
          isAnchor,
          anchorLabel: isAnchor ? anchorLabel : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Deposit failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/corpus");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <p
          className="text-xl font-normal"
          style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", color: "#1A1816" }}
        >
          Deposited.
        </p>
        <p className="text-sm mt-2" style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
          Your thought has been added to the corpus.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Prompt selection */}
      <div>
        <p
          className="text-sm mb-3 font-medium"
          style={{ color: "#1A1816", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          Responding to a prompt? (optional)
        </p>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedPromptId(null)}
            className={`text-left px-4 py-3 rounded border text-sm transition-colors ${
              selectedPromptId === null
                ? "border-[#1A1816] bg-[#1A1816]/5"
                : "border-[#D6CFC0] hover:border-[#8C8478]"
            }`}
            style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", fontStyle: selectedPromptId === null ? "normal" : "italic", color: "#8C8478" }}
          >
            Free deposition — no prompt
          </button>
          {prompts.slice(0, 6).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPromptId(p.id)}
              className={`text-left px-4 py-3 rounded border text-sm transition-colors ${
                selectedPromptId === p.id
                  ? "border-[#1A1816] bg-[#1A1816]/5"
                  : "border-[#D6CFC0] hover:border-[#8C8478]"
              }`}
              style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", color: "#1A1816" }}
            >
              <span style={{ fontStyle: "italic" }}>{p.text}</span>
              {p.category && (
                <span
                  className="ml-2 text-xs"
                  style={{ color: "#8C8478", fontStyle: "normal", fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  {p.category}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Writing area */}
      <div>
        {selectedPrompt && (
          <p
            className="text-base mb-4 pb-4 border-b border-[#D6CFC0]"
            style={{
              fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
              fontStyle: "italic",
              color: "#1A1816",
            }}
          >
            {selectedPrompt.text}
          </p>
        )}
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          placeholder="Begin writing here. There is no minimum length — a sentence is enough."
          rows={12}
          className="w-full px-0 py-0 bg-transparent border-none outline-none resize-none"
          style={{
            fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
            fontSize: "1.15rem",
            lineHeight: "1.8",
            color: "#1A1816",
          }}
          autoFocus
        />
        <div className="mt-2 flex items-center justify-between">
          <span
            className="text-xs"
            style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {wordCount > 0 ? `${wordCount} word${wordCount !== 1 ? "s" : ""}` : ""}
          </span>
        </div>
      </div>

      {/* Anchor toggle */}
      <div className="border-t border-[#D6CFC0] pt-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnchor}
            onChange={(e) => setIsAnchor(e.target.checked)}
            className="w-4 h-4 accent-[#9C4221]"
          />
          <div>
            <span
              className="text-sm font-medium"
              style={{ color: "#1A1816", fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              Mark as Anchor
            </span>
            <p
              className="text-xs mt-0.5"
              style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              This records a decision or commitment. It becomes queryable via decision-memory.
            </p>
          </div>
        </label>
        {isAnchor && (
          <input
            type="text"
            placeholder="Short label, e.g. 'Decided to focus on European market'"
            value={anchorLabel}
            onChange={(e) => setAnchorLabel(e.target.value)}
            className="mt-3 w-full px-3 py-2 text-sm border border-[#D6CFC0] rounded bg-transparent focus:border-[#8C8478] focus:outline-none"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif", color: "#1A1816" }}
          />
        )}
      </div>

      {error && (
        <p className="text-sm" style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" loading={loading} disabled={!bodyText.trim()}>
          Deposit
        </Button>
        <span
          className="text-xs"
          style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          Your deposition will be embedded and added to the corpus.
        </span>
      </div>
    </form>
  );
}
