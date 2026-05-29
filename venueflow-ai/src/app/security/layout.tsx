"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const SEC_NAV = [
  { icon: "🛡️", label: "Overview", href: "/security" },
  { icon: "🚨", label: "Incidents", href: "/security/incidents" },
  { icon: "📍", label: "Live Map", href: "/security/map" },
  { icon: "🆘", label: "SOS Feed", href: "/security/sos" },
  { icon: "🚶", label: "Missing Persons", href: "/security/missing" },
];

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--vf-bg-primary)" }}>
      <aside style={{ width: 240, background: "var(--vf-bg-secondary)", borderRight: "1px solid var(--vf-border)", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50 }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--vf-border)" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--vf-grad-danger)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🛡️</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--vf-text-primary)" }}>FlowSphere</span>
          </Link>
          <div style={{ marginTop: 12, padding: "8px 10px", background: "rgba(244,63,94,0.1)", borderRadius: 10, border: "1px solid rgba(244,63,94,0.2)" }}>
            <div style={{ fontSize: 11, color: "var(--vf-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Role</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F43F5E", marginTop: 2 }}>🛡️ Security Operations</div>
          </div>
        </div>
        <nav style={{ padding: "12px 12px", flex: 1 }}>
          {SEC_NAV.map(item => (
            <Link key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? "active" : ""}`} style={{ marginBottom: 2, ...(pathname === item.href ? { borderLeftColor: "#F43F5E", color: "#F43F5E", background: "rgba(244,63,94,0.1)" } : {}) }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--vf-border)" }}>
          <div style={{ padding: "12px 14px", background: "rgba(244,63,94,0.15)", borderRadius: 10, border: "2px solid rgba(244,63,94,0.4)", cursor: "pointer", textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🚨</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#F43F5E" }}>EMERGENCY BROADCAST</div>
            <div style={{ fontSize: 10, color: "var(--vf-text-muted)", marginTop: 2 }}>Alert all staff & attendees</div>
          </div>
          <Link href="/" style={{ display: "block", textDecoration: "none", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: 8, color: "var(--vf-text-secondary)", fontSize: 13, fontWeight: 600, textAlign: "center", border: "1px solid var(--vf-border)" }}>
            🚪 Logout
          </Link>
        </div>
      </aside>
      <main style={{ flex: 1, marginLeft: 240, minHeight: "100vh" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(8,14,30,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(244,63,94,0.2)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>
            {SEC_NAV.find(n => n.href === pathname)?.icon} {SEC_NAV.find(n => n.href === pathname)?.label ?? "Security"}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="status-badge status-danger"><span className="pulse-dot pulse-dot-red" />Security Active</div>
          </div>
        </header>
        <div style={{ padding: "24px" }}>
          <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
