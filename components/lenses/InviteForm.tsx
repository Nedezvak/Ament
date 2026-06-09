"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function InviteForm({ organisationId }: { organisationId: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, organisationId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invite");

      setSuccess(`Invite sent to ${email}.`);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <Input
          type="email"
          placeholder="colleague@organisation.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" loading={loading} disabled={!email.trim()}>
        Invite
      </Button>
      {error && (
        <p className="text-sm absolute mt-12" style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm absolute mt-12" style={{ color: "#1A1816", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
          {success}
        </p>
      )}
    </form>
  );
}
