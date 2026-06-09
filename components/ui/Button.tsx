"use client";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:
    "bg-[#1A1816] text-[#F4EFE4] hover:bg-[#2d2a27] active:bg-[#111] border border-[#1A1816]",
  secondary:
    "bg-transparent text-[#1A1816] hover:bg-[#1A1816]/5 border border-[#D6CFC0] hover:border-[#8C8478]",
  ghost:
    "bg-transparent text-[#1A1816] hover:bg-[#1A1816]/5 border border-transparent",
  danger:
    "bg-transparent text-[#9C4221] hover:bg-[#9C4221]/5 border border-[#9C4221]/30 hover:border-[#9C4221]",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2
          rounded transition-colors duration-100
          font-ui font-medium
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
