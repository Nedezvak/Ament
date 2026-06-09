import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: "#1A1816", fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 rounded border text-sm
            bg-[#F4EFE4] text-[#1A1816]
            placeholder:text-[#8C8478]
            transition-colors duration-100
            ${error
              ? "border-[#9C4221] focus:border-[#9C4221] focus:ring-1 focus:ring-[#9C4221]"
              : "border-[#D6CFC0] focus:border-[#8C8478] focus:outline-none focus:ring-1 focus:ring-[#8C8478]"
            }
            ${className}
          `}
          style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: "#9C4221" }}>{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs" style={{ color: "#8C8478" }}>{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
