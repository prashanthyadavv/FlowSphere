import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme: "dark" | "light";
  toggleTheme: () => void;
  applyTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",

      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", next);
        }
      },

      applyTheme: () => {
        const { theme } = get();
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
        }
      },
    }),
    { name: "flowsphere-theme", version: 1 }
  )
);
