import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function LoginErrorPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "#F4EFE4" }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <Logo size="lg" />
        </div>
        <h1
          className="text-xl font-normal mb-3"
          style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", color: "#1A1816" }}
        >
          Sign-in failed.
        </h1>
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          Something went wrong with that sign-in link. It may have expired.
        </p>
        <Link
          href="/login"
          className="text-sm"
          style={{ color: "#9C4221", fontFamily: "var(--font-inter), Inter, sans-serif", textDecoration: "none" }}
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
