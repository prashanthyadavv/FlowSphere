import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DemoState {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (active: boolean) => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemoMode: false, // Default to production mode
      toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
      setDemoMode: (active) => set({ isDemoMode: active }),
    }),
    {
      name: "flowsphere-demo-mode",
    }
  )
);
