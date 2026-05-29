"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Platform", href: "#features" },
  { label: "Live Demo", href: "/attendee" },
  { label: "Admin", href: "/admin" },
  { label: "Security", href: "/security" },
];

const STATS = [
  { value: "100K+", label: "Concurrent Attendees" },
  { value: "< 50ms", label: "Real-Time Latency" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "40+", label: "Venue Modules" },
];

const FEATURES = [
  { icon: "🗺️", title: "AI Crowd Navigation", desc: "Real-time indoor maps with crowd-aware routing. Fastest path to your seat, food, or exit — updated every 5 seconds.", tag: "AI Powered" },
  { icon: "📊", title: "Live Density Heatmaps", desc: "Visualize crowd hotspots across all zones instantly. Predict congestion before it becomes a bottleneck.", tag: "Real-Time" },
  { icon: "🍔", title: "Smart Queue Management", desc: "AI-predicted wait times, virtual token queues, and pre-ordering so attendees never waste time standing in line.", tag: "Zero Wait" },
  { icon: "🅿️", title: "Smart Parking & Transport", desc: "Dynamic parking allocation, live space tracking, and exit routing optimized for post-event traffic flow.", tag: "Integrated" },
  { icon: "🚨", title: "Emergency Response", desc: "SOS broadcasting, one-tap incident reporting, evacuation routing, and panic detection with sub-second alerting.", tag: "Critical Safety" },
  { icon: "🏟️", title: "Admin Control Center", desc: "Enterprise dashboards with crowd analytics, revenue insights, gate operations, vendor monitoring, and AI alerts.", tag: "Enterprise" },
  { icon: "🎫", title: "Smart Ticketing & Access", desc: "QR/NFC digital tickets, anti-fraud verification, dynamic gate allocation, and digital wallet integration.", tag: "Secure" },
  { icon: "🤖", title: "AI Analytics Engine", desc: "Predictive crowd models, demand forecasting, queue predictions, and anomaly detection running at the edge.", tag: "ML Powered" },
];

const ROLES = [
  { role: "Attendee", desc: "Navigate, order food, manage your ticket, get real-time alerts", href: "/attendee", color: "#00D4FF", icon: "👤" },
  { role: "Admin", desc: "Full venue control — crowd, revenue, gates, staff coordination", href: "/admin", color: "#8B5CF6", icon: "🎛️" },
  { role: "Security", desc: "Incident management, SOS response, evacuation control", href: "/security", color: "#F43F5E", icon: "🛡️" },
  { role: "Vendor", desc: "Orders, revenue, inventory and kitchen queue management", href: "/vendor", color: "#10B981", icon: "🍽️" },
];

export default function LandingPage() {
  const [count, setCount] = useState({ attendees: 0, latency: 0, uptime: 0, modules: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const targets = { attendees: 100, latency: 50, uptime: 9999, modules: 40 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        attendees: Math.round(targets.attendees * ease),
        latency: Math.round(targets.latency * ease),
        uptime: Math.round(targets.uptime * ease),
        modules: Math.round(targets.modules * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: "var(--vf-bg-primary)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: "1px solid var(--vf-border)", backdropFilter: "blur(20px)", background: "rgba(5,10,20,0.85)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--vf-grad-cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--vf-text-primary)" }}>FlowSphere <span className="grad-text-cyan">AI</span></span>
          </Link>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} style={{ color: "var(--vf-text-secondary)", fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "6px 14px", borderRadius: 8, transition: "all 0.15s" }}>
                {l.label}
              </Link>
            ))}
            <Link href="/attendee" style={{ background: "var(--vf-grad-cyan)", color: "#050A14", fontWeight: 700, fontSize: 13, padding: "8px 20px", borderRadius: 10, textDecoration: "none", letterSpacing: "0.02em" }}>
              Launch Demo →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px", position: "relative", background: "var(--vf-grad-hero)" }}>
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
        
        {/* Glowing orbs */}
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,127,255,0.15) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="status-badge status-live" style={{ marginBottom: 24, display: "inline-flex" }}>
              <span className="pulse-dot pulse-dot-green" />
              LIVE DEMO ACTIVE — 52,847 Attendees Online
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 7vw, 88px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.02em" }}>
            <span className="grad-text-hero">Intelligent Crowd</span>
            <br />Movement Platform
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "var(--vf-text-secondary)", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.7 }}>
            FlowSphere transforms large-scale sporting events into seamless, intelligent experiences. Real-time crowd management, AI navigation, and smart operations for <strong style={{ color: "var(--vf-text-primary)" }}>100,000+ attendees</strong>.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/attendee" style={{ background: "var(--vf-grad-cyan)", color: "#050A14", fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "var(--vf-shadow-cyan)" }}>
              🎟️ Attendee Experience
            </Link>
            <Link href="/admin" style={{ background: "var(--vf-bg-glass)", color: "var(--vf-text-primary)", fontWeight: 600, fontSize: 16, padding: "14px 32px", borderRadius: 12, textDecoration: "none", border: "1px solid var(--vf-border)", backdropFilter: "blur(10px)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              🎛️ Admin Center
            </Link>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
          style={{ position: "relative", zIndex: 1, marginTop: 80, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, maxWidth: 800, width: "100%", background: "var(--vf-border)", borderRadius: 16, overflow: "hidden" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: "var(--vf-bg-secondary)", padding: "24px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "var(--vf-cyan)" }} className="text-glow-cyan">{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--vf-text-muted)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, marginBottom: 16 }}>
            Every Problem. <span className="grad-text-cyan">Solved.</span>
          </h2>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 18, maxWidth: 560, margin: "0 auto" }}>
            18 real operational problems addressed with AI, real-time data, and smart venue infrastructure.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="glass card-hover" style={{ padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{f.title}</h3>
              </div>
              <span className="status-badge status-info" style={{ marginBottom: 10, display: "inline-flex" }}>{f.tag}</span>
              <p style={{ color: "var(--vf-text-secondary)", fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ROLE ENTRY POINTS */}
      <section style={{ padding: "80px 24px", background: "var(--vf-bg-secondary)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 700, marginBottom: 12 }}>
              Built for Every <span className="grad-text-purple">Role</span>
            </h2>
            <p style={{ color: "var(--vf-text-secondary)", fontSize: 16 }}>One platform, seven user roles, zero compromises.</p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {ROLES.map((r, i) => (
              <motion.div key={r.role} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link href={r.href} style={{ textDecoration: "none" }}>
                  <div className="glass card-hover" style={{ padding: 28, borderTop: `3px solid ${r.color}`, cursor: "pointer" }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>{r.icon}</div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 8, color: r.color }}>{r.role}</h3>
                    <p style={{ color: "var(--vf-text-secondary)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{r.desc}</p>
                    <span style={{ color: r.color, fontSize: 13, fontWeight: 600 }}>Enter as {r.role} →</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 42px)", fontWeight: 700, marginBottom: 12 }}>Enterprise-Grade <span className="grad-text-cyan">Tech Stack</span></h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {["Next.js 14", "TypeScript", "NestJS", "PostgreSQL", "Redis", "Socket.io", "Framer Motion", "TanStack Query", "Zustand", "Docker", "Kubernetes", "FastAPI"].map((tech, i) => (
            <motion.div key={tech} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="glass" style={{ padding: "14px 20px", textAlign: "center", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--vf-text-secondary)" }}>
              {tech}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "linear-gradient(180deg, var(--vf-bg-primary) 0%, rgba(59,127,255,0.08) 50%, var(--vf-bg-primary) 100%)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 800, marginBottom: 20 }}>
            The Future of <span className="grad-text-hero">Stadium Experience</span>
          </h2>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 18, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            Explore the complete platform live — no signup required.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/attendee" style={{ background: "var(--vf-grad-cyan)", color: "#050A14", fontWeight: 700, fontSize: 16, padding: "16px 36px", borderRadius: 12, textDecoration: "none", boxShadow: "var(--vf-shadow-cyan)" }}>
              🎟️ Explore Attendee View
            </Link>
            <Link href="/admin" style={{ background: "rgba(139,92,246,0.2)", color: "#8B5CF6", fontWeight: 700, fontSize: 16, padding: "16px 36px", borderRadius: 12, textDecoration: "none", border: "1px solid rgba(139,92,246,0.4)" }}>
              🎛️ Explore Admin Center
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--vf-border)", padding: "40px 24px", textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8, color: "var(--vf-text-primary)" }}>
          ⚡ FlowSphere <span className="grad-text-cyan">AI</span>
        </div>
        <p>Intelligent Crowd Movement &amp; Real-Time Event Experience Platform</p>
        <p style={{ marginTop: 8 }}>Built with Next.js · NestJS · PostgreSQL · Redis · Socket.io · AI/ML Analytics</p>
      </footer>
    </div>
  );
}
