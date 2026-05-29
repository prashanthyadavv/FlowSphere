import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "attendee" | "admin" | "security";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
};

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
};

// Demo credentials — replace with real JWT in production
const DEMO_USERS = [
  { id: "att-001", name: "Raj Kumar", email: "attendee@flowsphere.io", password: "Attendee@123", role: "attendee" as UserRole, avatar: "🙋" },
  { id: "adm-001", name: "Priya Sharma", email: "admin@flowsphere.io", password: "Admin@123", role: "admin" as UserRole, avatar: "👩‍💼" },
  { id: "sec-001", name: "Arjun Singh", email: "security@flowsphere.io", password: "Security@123", role: "security" as UserRole, avatar: "👮" },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const found = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (found) {
          const { password: _pw, ...safeUser } = found;
          set({ user: safeUser, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: "Invalid email or password. Check the demo credentials." };
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "flowsphere-auth", version: 1 }
  )
);
