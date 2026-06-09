import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ament — organisational intelligence",
  description:
    "ament turns your organisation into a living interlocutor — a body of accumulated thought you can query, reflect on, and inherit.",
  icons: {
    // The "a." mark as a simple SVG favicon — Siena on Paper
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EFE4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${inter.variable} h-full`}
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <body className="min-h-full flex flex-col" style={{ background: "#F4EFE4", color: "#1A1816" }}>
        {children}
      </body>
    </html>
  );
}
