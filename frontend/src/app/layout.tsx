"use client";

import "./globals.css";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Calculator,
  Shield,
  AlertTriangle,
  Scale,
  TrendingUp,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";
import type { ReactNode } from "react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const navItems = [
  { href: "/", label: "PECV Calculator", icon: Calculator },
  { href: "/risk", label: "Risk Calculator", icon: Shield },
  { href: "/criticality", label: "Criticality Assessor", icon: AlertTriangle },
  { href: "/compliance", label: "Framework Compliance", icon: Scale },
  { href: "/maturity", label: "Maturity Assessor", icon: TrendingUp },
  { href: "/docs", label: "Documentation", icon: BookOpen },
];

function Sidebar({
  theme,
  onToggleTheme,
}: {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      style={{ width: "var(--sidebar-width)" }}
      className="fixed top-0 left-0 h-screen flex flex-col z-50"
    >
      {/* Left-edge accent glow line */}
      <div
        className="absolute top-0 left-0 w-px h-full"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, var(--accent) 15%, var(--accent) 85%, transparent 100%)",
          boxShadow: "0 0 8px var(--accent), 0 0 20px color-mix(in srgb, var(--accent) 30%, transparent)",
        }}
      />

      <div
        className="flex flex-col h-full"
        style={{
          backgroundColor: "var(--surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Title block */}
        <div
          className="px-5 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h1
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            AIMS
          </h1>
          <p
            className="text-xs mt-0.5 tracking-wide uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Computation Engine
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors relative"
                style={{
                  color: active ? "var(--text)" : "var(--text-muted)",
                  backgroundColor: active ? "var(--surface-alt)" : "transparent",
                  borderLeft: active
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "var(--surface-alt)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }
                }}
              >
                <Icon
                  size={16}
                  style={{ color: active ? "var(--accent)" : "inherit" }}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle + version */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            className="text-[11px] font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            v0.1.0
          </span>
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-md transition-colors cursor-pointer"
            style={{
              color: "var(--text-muted)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-alt)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans`}
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        <Sidebar theme={theme} onToggleTheme={toggleTheme} />
        <main
          style={{
            marginLeft: "var(--sidebar-width)",
            minHeight: "100vh",
            backgroundColor: "var(--bg)",
            padding: "2rem",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
