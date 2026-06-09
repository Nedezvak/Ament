import { Logo } from "@/components/ui/Logo";

export default function VerifyPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#F4EFE4" }}
    >
      <div className="w-full max-w-sm text-center">
        <div className="mb-10">
          <Logo size="lg" />
        </div>
        <h1
          className="text-xl font-normal mb-3"
          style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", color: "#1A1816" }}
        >
          Check your email.
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          A sign-in link has been sent to your email address.
          Click it to sign in to ament.
        </p>
      </div>
    </div>
  );
}
