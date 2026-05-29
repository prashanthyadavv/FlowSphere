"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/lib/store/authStore";
import { useDemoStore } from "@/lib/store/demoStore";

const ADMIN_NAV = [
  { icon: "🎛️", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Crowd Analytics", href: "/admin/crowd" },
  { icon: "🚨", label: "Incidents", href: "/admin/incidents" },
  { icon: "📅", label: "Events", href: "/admin/events" },
  { icon: "👤", label: "Users", href: "/admin/users" },
  { icon: "🏟️", label: "Venues & Zones", href: "/admin/venues" },
  { icon: "🍽️", label: "Vendors", href: "/admin/vendors" },
  { icon: "🅿️", label: "Gates & Parking", href: "/admin/gates" },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isDemoMode, toggleDemoMode } = useDemoStore();

  const handleLogout = () => { logout(); router.push("/login"); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--vf-bg-primary)" }}>
      <aside style={{ width: 240, background: "var(--vf-bg-secondary)", borderRight: "1px solid var(--vf-border)", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50 }}>
        <div style={{ padding: "18px 16px", borderBottom: "1px solid var(--vf-border)" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--vf-grad-purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--vf-text-primary)" }}>FlowSphere</span>
          </Link>
          <div style={{ padding: "10px 12px", background: "rgba(139,92,246,0.1)", borderRadius: 10, border: "1px solid rgba(139,92,246,0.2)" }}>
            <div style={{ fontSize: 11, color: "var(--vf-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Admin Panel</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#8B5CF6", marginTop: 2 }}>{user?.avatar} {user?.name}</div>
          </div>
        </div>

        <nav style={{ padding: "10px 10px", flex: 1, overflowY: "auto" }}>
          {ADMIN_NAV.map(item => (
            <Link key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
              style={{ marginBottom: 2, ...(pathname === item.href ? { borderLeftColor: "#8B5CF6", color: "#8B5CF6", background: "rgba(139,92,246,0.1)" } : {}) }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: "12px 12px", borderTop: "1px solid var(--vf-border)", display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={toggleDemoMode}
            style={{ width: "100%", padding: "9px", background: isDemoMode ? "rgba(16,185,129,0.1)" : "var(--vf-bg-glass)", border: `1px solid ${isDemoMode ? "rgba(16,185,129,0.3)" : "var(--vf-border)"}`, borderRadius: 10, color: isDemoMode ? "#10B981" : "var(--vf-text-secondary)", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>🧪 Demo Mode</span>
            <span>{isDemoMode ? "ON" : "OFF"}</span>
          </button>
          <Link href="/security" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "rgba(244,63,94,0.1)", borderRadius: 10, border: "1px solid rgba(244,63,94,0.2)" }}>
            <span>🛡️</span><span style={{ fontSize: 12, fontWeight: 700, color: "#F43F5E" }}>Security Ops</span>
          </Link>
          <button onClick={handleLogout}
            style={{ width: "100%", padding: "9px", background: "var(--vf-bg-glass)", border: "1px solid var(--vf-border)", borderRadius: 10, color: "var(--vf-text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: 240, minHeight: "100vh" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(8,14,30,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--vf-border)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--vf-text-primary)" }}>
            {ADMIN_NAV.find(n => n.href === pathname)?.icon} {ADMIN_NAV.find(n => n.href === pathname)?.label ?? "Admin"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--vf-text-secondary)" }}>National Stadium, Mumbai</span>
            <div className="status-badge status-live"><span className="pulse-dot pulse-dot-green" />Control Active</div>
            <ThemeToggle />
          </div>
        </header>
        <div style={{ padding: "24px" }}>
          <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRole="admin">
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
