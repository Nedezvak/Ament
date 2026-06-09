interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  maxWidth?: "prose" | "wide" | "full";
}

const maxWidths = {
  prose: "max-w-3xl",
  wide: "max-w-6xl",
  full: "max-w-full",
};

export function PageShell({
  children,
  title,
  subtitle,
  actions,
  maxWidth = "wide",
}: PageShellProps) {
  return (
    <main className={`${maxWidths[maxWidth]} mx-auto px-6 py-10 flex-1`}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            {title && (
              <h1
                className="text-2xl font-normal tracking-tight"
                style={{
                  fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif",
                  color: "#1A1816",
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                className="mt-1 text-sm"
                style={{
                  color: "#8C8478",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </main>
  );
}
