"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/lib/store/authStore";

const ATTENDEE_NAV = [
  { icon: "🏠", label: "Dashboard", href: "/attendee" },
  { icon: "🗺️", label: "Stadium Map", href: "/attendee/map" },
  { icon: "🎫", label: "My Ticket", href: "/attendee/ticket" },
  { icon: "🍔", label: "Food & Menu", href: "/attendee/food" },
  { icon: "⏱️", label: "Queue Tracker", href: "/attendee/queues" },
  { icon: "🅿️", label: "Parking", href: "/attendee/parking" },
  { icon: "🤖", label: "AI Assistant", href: "/attendee/assistant" },
  { icon: "🔔", label: "Notifications", href: "/attendee/notifications" },
];

function AttendeeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--vf-bg-primary)" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "var(--vf-bg-secondary)", borderRight: "1px solid var(--vf-border)", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50 }}>
        <div style={{ padding: "18px 16px", borderBottom: "1px solid var(--vf-border)" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--vf-grad-cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--vf-text-primary)" }}>FlowSphere</span>
          </Link>
          <div style={{ padding: "10px 12px", background: "rgba(0,212,255,0.08)", borderRadius: 10, border: "1px solid rgba(0,212,255,0.15)" }}>
            <div style={{ fontSize: 11, color: "var(--vf-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Logged in as</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vf-text-primary)", marginTop: 2 }}>{user?.avatar} {user?.name}</div>
            <div className="status-badge status-live" style={{ marginTop: 6, display: "inline-flex" }}><span className="pulse-dot pulse-dot-green" />Live Event</div>
          </div>
        </div>

        <nav style={{ padding: "10px 10px", flex: 1, overflowY: "auto" }}>
          {ATTENDEE_NAV.map(item => (
            <Link key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? "active" : ""}`} style={{ marginBottom: 2 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: "12px 12px", borderTop: "1px solid var(--vf-border)", display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/security" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "rgba(244,63,94,0.1)", borderRadius: 10, border: "1px solid rgba(244,63,94,0.25)", cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>🚨</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#F43F5E" }}>Emergency SOS</div>
                <div style={{ fontSize: 10, color: "var(--vf-text-muted)" }}>Tap to report</div>
              </div>
            </div>
          </Link>
          <button onClick={handleLogout}
            style={{ width: "100%", padding: "9px", background: "var(--vf-bg-glass)", border: "1px solid var(--vf-border)", borderRadius: 10, color: "var(--vf-text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: "100vh" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(var(--vf-bg-primary-rgb, 8,14,30), 0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--vf-border)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--vf-text-primary)" }}>
            {ATTENDEE_NAV.find(n => n.href === pathname)?.icon} {ATTENDEE_NAV.find(n => n.href === pathname)?.label ?? "Attendee"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--vf-text-secondary)" }}>🏟️ National Stadium, Mumbai</span>
            <div className="status-badge status-live"><span className="pulse-dot pulse-dot-green" />Live</div>
            <ThemeToggle />
            <Link href="/attendee/notifications" style={{ textDecoration: "none", position: "relative" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--vf-bg-glass)", border: "1px solid var(--vf-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>🔔</div>
              <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#F43F5E", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>3</span>
            </Link>
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

export default function AttendeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRole="attendee">
      <AttendeeShell>{children}</AttendeeShell>
    </AuthGuard>
  );
}
