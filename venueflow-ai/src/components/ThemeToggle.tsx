"use client";
import { useThemeStore } from "@/lib/store/themeStore";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: "var(--vf-bg-glass)",
        border: "1px solid var(--vf-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        cursor: "pointer",
        transition: "all 0.2s ease",
        flexShrink: 0,
        color: "var(--vf-text-primary)",
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
