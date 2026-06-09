// The "a." mark — ament's identity.
// Used in the nav and on the auth pages.
// The "a" is in Ink; the "." is in Siena.

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <span
      className={`font-display tracking-tight select-none ${sizes[size]} ${className}`}
      style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif" }}
    >
      <span style={{ color: "#1A1816" }}>a</span>
      <span style={{ color: "#9C4221" }}>.</span>
    </span>
  );
}
