"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";

interface PeriodItem {
  period: string;
  depositionCount: number;
  essay: { id: string; period: string; title: string; generatedAt: string } | null;
}

interface EssayListClientProps {
  periods: PeriodItem[];
}

export function EssayListClient({ periods }: EssayListClientProps) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatedEssays, setGeneratedEssays] = useState<
    Record<string, { id: string; title: string }>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function generateEssay(period: string, forceRegenerate = false) {
    setGenerating(period);
    setErrors((prev) => ({ ...prev, [period]: "" }));

    try {
      const res = await fetch("/api/essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period, forceRegenerate }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Essay generation failed");
      }

      setGeneratedEssays((prev) => ({
        ...prev,
        [period]: { id: data.id, title: data.title },
      }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [period]: err instanceof Error ? err.message : "Generation failed.",
      }));
    } finally {
      setGenerating(null);
    }
  }

  if (periods.length === 0) {
    return (
      <div className="py-16 text-center">
        <p
          className="text-lg"
          style={{
            fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
            fontStyle: "italic",
            color: "#8C8478",
          }}
        >
          No depositions yet. An Essay requires at least one quarter of thought.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {periods.map(({ period, depositionCount, essay }) => {
        const generated = generatedEssays[period];
        const currentEssay = generated ? { id: generated.id, title: generated.title, generatedAt: new Date().toISOString() } : essay;
        const isGenerating = generating === period;
        const errorMsg = errors[period];

        return (
          <div
            key={period}
            className="border border-[#D6CFC0] rounded-sm px-6 py-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant="period">{period}</Badge>
                  <span
                    className="text-xs"
                    style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {depositionCount} deposition{depositionCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {currentEssay ? (
                  <>
                    <Link
                      href={`/essay/${currentEssay.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h3
                        className="text-base hover:underline"
                        style={{
                          fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                          color: "#1A1816",
                          lineHeight: "1.4",
                        }}
                      >
                        {currentEssay.title}
                      </h3>
                    </Link>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
                    >
                      Generated {format(new Date(currentEssay.generatedAt), "d MMM yyyy")}
                    </p>
                  </>
                ) : (
                  <p
                    className="text-sm"
                    style={{
                      color: "#8C8478",
                      fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                      fontStyle: "italic",
                    }}
                  >
                    No essay generated for this period.
                  </p>
                )}

                {errorMsg && (
                  <p
                    className="text-sm mt-2"
                    style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {errorMsg}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                {!currentEssay ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={isGenerating}
                    disabled={depositionCount < 3}
                    onClick={() => generateEssay(period)}
                  >
                    {depositionCount < 3 ? "Need 3+ depositions" : "Generate Essay"}
                  </Button>
                ) : (
                  <>
                    <Link href={`/essay/${currentEssay.id}`} style={{ textDecoration: "none" }}>
                      <Button size="sm" variant="secondary">Read Essay</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={isGenerating}
                      onClick={() => generateEssay(period, true)}
                    >
                      Regenerate
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
