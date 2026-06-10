"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Something went wrong. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#F4EFE4" }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Logo size="lg" />
        </div>

        {sent ? (
          <div className="text-center">
            <p
              className="text-base leading-relaxed mb-2"
              style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", color: "#1A1816" }}
            >
              A sign-in link has been sent to{" "}
              <span style={{ fontStyle: "italic" }}>{email}</span>.
            </p>
            <p
              className="text-sm"
              style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              Check your inbox and click the link to continue.
            </p>
          </div>
        ) : (
          <>
            <p
              className="text-center mb-8 text-base"
              style={{
                color: "#8C8478",
                fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                fontStyle: "italic",
              }}
            >
              Sign in to your organisation.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@organisation.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              {error && (
                <p className="text-sm" style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                  {error}
                </p>
              )}
              <Button type="submit" loading={loading} className="w-full">
                Send sign-in link
              </Button>
            </form>

            <p
              className="mt-8 text-xs text-center"
              style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              No password required. We send a secure link to your email.
            </p>

            {process.env.NODE_ENV === "development" && (
              <DevLogin />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Development-only quick sign-in — lets a non-technical operator test the
// app locally without configuring email. Not shown in production.
function DevLogin() {
  const [email, setEmail] = useState("nemefer@gmail.com");
  const [loading, setLoading] = useState(false);

  async function handleDevLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", { email, redirect: true, callbackUrl: "/dashboard" });
  }

  return (
    <div className="mt-8 pt-6 border-t border-[#D6CFC0]">
      <p className="text-xs mb-2" style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
        Development only — sign in as a seeded demo persona:
      </p>
      <form onSubmit={handleDevLogin} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-2 py-1.5 text-xs border border-[#D6CFC0] rounded bg-transparent"
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif", color: "#1A1816" }}
        />
        <Button type="submit" size="sm" variant="secondary" loading={loading}>
          Dev sign in
        </Button>
      </form>
    </div>
  );
}
