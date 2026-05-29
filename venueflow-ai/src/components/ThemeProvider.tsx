"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/themeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const applyTheme = useThemeStore((s) => s.applyTheme);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return <>{children}</>;
}
