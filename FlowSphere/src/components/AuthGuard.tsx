"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type UserRole } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export default function AuthGuard({ children, allowedRole }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/login");
    } else if (user.role !== allowedRole && !(allowedRole === "attendee" && user.role === "attendee")) {
      // Security can access security, admin can access admin
      if (user.role !== allowedRole) {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, user, allowedRole, router]);

  if (!isAuthenticated || !user || user.role !== allowedRole) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--vf-bg-primary)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--vf-text-secondary)" }}>Verifying access...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
