interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "anchor" | "theme" | "period";
  className?: string;
}

const variants = {
  default: "bg-[#D6CFC0]/60 text-[#1A1816]",
  anchor: "bg-[#9C4221]/10 text-[#9C4221] border border-[#9C4221]/20",
  theme: "bg-[#1A1816]/5 text-[#8C8478]",
  period: "bg-transparent text-[#8C8478] border border-[#D6CFC0]",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
      style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
    >
      {children}
    </span>
  );
}
