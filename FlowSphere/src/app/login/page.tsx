"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store/authStore";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

type RoleTab = "attendee" | "admin" | "security";

const ROLE_CONFIG: Record<RoleTab, {
  icon: string; label: string; color: string; bg: string;
  demo: { email: string; password: string }; redirect: string;
  desc: string;
}> = {
  attendee: {
    icon: "🎟️", label: "Attendee", color: "#00D4FF", bg: "rgba(0,212,255,0.12)",
    demo: { email: "attendee@flowsphere.io", password: "Attendee@123" },
    redirect: "/attendee",
    desc: "Access your ticket, navigate the venue, order food, and get real-time alerts.",
  },
  admin: {
    icon: "🎛️", label: "Admin", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)",
    demo: { email: "admin@flowsphere.io", password: "Admin@123" },
    redirect: "/admin",
    desc: "Full venue control — crowd analytics, CRUD operations, revenue, and incident management.",
  },
  security: {
    icon: "🛡️", label: "Security", color: "#F43F5E", bg: "rgba(244,63,94,0.12)",
    demo: { email: "security@flowsphere.io", password: "Security@123" },
    redirect: "/security",
    desc: "Incident response, SOS alerts, evacuation management, and staff coordination.",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuthStore();
  const [role, setRole] = useState<RoleTab>("attendee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(ROLE_CONFIG[user.role as RoleTab]?.redirect ?? "/attendee");
    }
  }, [isAuthenticated, user, router]);

  const cfg = ROLE_CONFIG[role];

  const fillDemo = () => {
    setEmail(cfg.demo.email);
    setPassword(cfg.demo.password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 700)); // simulate API call
    const result = login(email, password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        const loggedUser = useAuthStore.getState().user;
        router.push(ROLE_CONFIG[loggedUser?.role as RoleTab]?.redirect ?? "/attendee");
      }, 800);
    } else {
      setError(result.error ?? "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--vf-bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
    }}>
      {/* Background */}
      <div className="bg-grid" style={{ position: "fixed", inset: 0, opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "15%", left: "10%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${cfg.color}18 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", transition: "background 0.4s" }} />
      <div style={{ position: "fixed", bottom: "20%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,127,255,0.1) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />

      {/* Theme toggle top-right */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
        <ThemeToggle />
      </div>

      {/* Back to home */}
      <div style={{ position: "fixed", top: 20, left: 20, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--vf-text-secondary)", fontSize: 14, fontWeight: 600 }}>
          ← Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${cfg.color}, #3B7FFF)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 14px", transition: "background 0.4s" }}>⚡</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>FlowSphere <span className="grad-text-cyan">AI</span></h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>Sign in to your account</p>
        </div>

        <div className="glass" style={{ padding: 32, borderTop: `3px solid ${cfg.color}`, transition: "border-color 0.3s" }}>
          {/* Role Tabs */}
          <div style={{ display: "flex", background: "var(--vf-bg-secondary)", borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
            {(Object.keys(ROLE_CONFIG) as RoleTab[]).map(r => (
              <button key={r} onClick={() => { setRole(r); setError(""); setEmail(""); setPassword(""); }}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 9, fontWeight: 700, fontSize: 13,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  cursor: "pointer", border: "none", transition: "all 0.2s",
                  background: role === r ? ROLE_CONFIG[r].bg : "transparent",
                  color: role === r ? ROLE_CONFIG[r].color : "var(--vf-text-muted)",
                }}>
                <span>{ROLE_CONFIG[r].icon}</span>
                <span className="hide-on-mobile">{ROLE_CONFIG[r].label}</span>
              </button>
            ))}
          </div>

          {/* Role description */}
          <div style={{ marginBottom: 20, padding: "12px 14px", background: cfg.bg, borderRadius: 10, border: `1px solid ${cfg.color}30`, transition: "all 0.3s" }}>
            <p style={{ fontSize: 13, color: "var(--vf-text-secondary)", lineHeight: 1.5 }}>
              <span style={{ color: cfg.color, fontWeight: 700 }}>{cfg.icon} {cfg.label}:</span> {cfg.desc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--vf-text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder={`${role}@flowsphere.io`}
                required
                style={{ width: "100%", padding: "12px 14px", background: "var(--vf-bg-secondary)", border: `1px solid ${error ? "#F43F5E" : "var(--vf-border)"}`, borderRadius: 10, color: "var(--vf-text-primary)", fontSize: 14, outline: "none", fontFamily: "var(--font-sans)", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--vf-text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  required
                  style={{ width: "100%", padding: "12px 44px 12px 14px", background: "var(--vf-bg-secondary)", border: `1px solid ${error ? "#F43F5E" : "var(--vf-border)"}`, borderRadius: 10, color: "var(--vf-text-primary)", fontSize: 14, outline: "none", fontFamily: "var(--font-sans)", boxSizing: "border-box" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--vf-text-muted)" }}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginBottom: 16, padding: "10px 14px", background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 8, color: "#F43F5E", fontSize: 13 }}>
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ marginBottom: 16, padding: "10px 14px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, color: "#10B981", fontSize: 13, fontWeight: 700 }}>
                  ✅ Login successful! Redirecting...
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading || success}
              style={{ width: "100%", padding: "13px", background: loading || success ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, ${cfg.color}, #3B7FFF)`, color: loading || success ? "var(--vf-text-muted)" : "#050A14", fontWeight: 800, fontSize: 15, borderRadius: 12, border: "none", cursor: loading || success ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "var(--font-display)" }}>
              {loading ? "Signing in..." : success ? "✅ Redirecting..." : `Sign in as ${cfg.label}`}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 20, padding: "14px", background: "var(--vf-bg-secondary)", borderRadius: 10, border: "1px solid var(--vf-border)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--vf-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Demo Credentials</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--vf-text-secondary)", marginBottom: 4 }}>📧 {cfg.demo.email}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--vf-text-secondary)", marginBottom: 10 }}>🔑 {cfg.demo.password}</div>
            <button onClick={fillDemo}
              style={{ width: "100%", padding: "8px", background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30`, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              ⚡ Auto-fill Demo Credentials
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 12, marginTop: 16 }}>
          FlowSphere · Production-grade Smart Venue Platform
        </p>
      </motion.div>
    </div>
  );
}
