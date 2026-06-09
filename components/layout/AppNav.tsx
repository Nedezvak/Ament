"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

const navItems = [
  { href: "/deposit", label: "Deposit" },
  { href: "/mirror", label: "Mirror" },
  { href: "/seam", label: "Seam" },
  { href: "/essay", label: "Essay" },
  { href: "/inheritance", label: "Inheritance" },
  { href: "/anchors", label: "Anchors" },
  { href: "/corpus", label: "Corpus" },
];

interface AppNavProps {
  orgName?: string;
}

export function AppNav({ orgName }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="border-b border-[#D6CFC0] bg-[#F4EFE4]"
      style={{ position: "sticky", top: 0, zIndex: 40 }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
        {/* Logo + org name */}
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0 no-underline">
          <Logo size="md" />
          {orgName && (
            <span
              className="text-sm hidden sm:block"
              style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              {orgName}
            </span>
          )}
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors
                  ${isActive
                    ? "text-[#1A1816] bg-[#1A1816]/5"
                    : "text-[#8C8478] hover:text-[#1A1816] hover:bg-[#1A1816]/5"
                  }
                `}
                style={{ fontFamily: "var(--font-inter), Inter, sans-serif", textDecoration: "none" }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Settings */}
        <Link
          href="/settings"
          className="shrink-0 text-sm transition-colors"
          style={{
            color: pathname.startsWith("/settings") ? "#1A1816" : "#8C8478",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            textDecoration: "none",
          }}
        >
          Settings
        </Link>
      </div>
    </nav>
  );
}
