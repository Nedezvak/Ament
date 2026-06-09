import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "#F4EFE4" }}
    >
      <Logo size="lg" className="mb-8" />
      <h1
        className="text-3xl md:text-4xl mb-4 max-w-xl"
        style={{
          fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
          color: "#1A1816",
          lineHeight: 1.3,
          fontWeight: 400,
        }}
      >
        Your organisation, as a living interlocutor.
      </h1>
      <p
        className="text-base mb-10 max-w-md"
        style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif", lineHeight: 1.7 }}
      >
        ament accumulates your organisation's thought over time, and lets you query
        its past reasoning, surface its tensions, and reflect on its identity.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center px-6 py-3 rounded bg-[#1A1816] text-[#F4EFE4] text-sm hover:bg-[#2d2a27] transition-colors"
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif", textDecoration: "none" }}
      >
        Sign in
      </Link>
    </div>
  );
}
