"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function NewOrganisationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/organisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors?.[0] || "Failed to create organisation");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#F4EFE4" }}>
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Logo size="lg" />
        </div>
        <h1
          className="text-xl mb-1 text-center"
          style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", color: "#1A1816" }}
        >
          Begin a new corpus.
        </h1>
        <p
          className="text-sm mb-8 text-center"
          style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          Name your organisation. You can invite members afterwards.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Organisation name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Halden Partners"
            required
            autoFocus
          />
          <Input
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of what you do"
          />
          {error && (
            <p className="text-sm" style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
              {error}
            </p>
          )}
          <Button type="submit" loading={loading} disabled={!name.trim()}>
            Create organisation
          </Button>
        </form>
      </div>
    </div>
  );
}
