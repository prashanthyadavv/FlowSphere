"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INCIDENTS, STAFF_MEMBERS, CROWD_ZONES, timeAgo } from "@/lib/mockData";
import { useDemoStore } from "@/lib/store/demoStore";
import { useDataStore } from "@/lib/store/dataStore";

const SEV_COLOR: Record<string, string> = { critical: "#F43F5E", high: "#F97316", medium: "#F59E0B", low: "#10B981" };
const TYPE_ICON: Record<string, string> = { security: "🔒", crowd: "👥", fire: "🔥", lost_person: "🔍", infrastructure: "⚙️", sos: "🆘" };

export default function SecurityOverview() {
  const { isDemoMode } = useDemoStore();
  const { zones: storedZones } = useDataStore();

  const [incidents, setIncidents] = useState(isDemoMode ? INCIDENTS : []);
  const [sosAlert, setSosAlert] = useState(false);
  const [selectedInc, setSelectedInc] = useState<string | null>(null);
  const [evacuationMode, setEvacuationMode] = useState(false);

  useEffect(() => {
    setIncidents(isDemoMode ? INCIDENTS : []);
    if (!isDemoMode) setSosAlert(false);
  }, [isDemoMode]);

  // Simulate new SOS after 8s
  useEffect(() => {
    if (!isDemoMode) return;
    const t = setTimeout(() => setSosAlert(true), 8000);
    return () => clearTimeout(t);
  }, [isDemoMode]);

  const resolve = (id: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: "resolved" as const } : i));
    setSelectedInc(null);
  };

  const zonesData = isDemoMode ? CROWD_ZONES : storedZones.map(z => ({
    id: z.id, name: z.name, capacity: z.capacity, current: 0, density: "comfortable" as any, trend: "stable" as any
  }));
  const criticalZones = zonesData.filter(z => z.density === "critical");
  const openInc = incidents.filter(i => i.status !== "resolved");
  const staffData = isDemoMode ? STAFF_MEMBERS : [];

  return (
    <div style={{ maxWidth: 1300 }}>
      {/* SOS Modal */}
      <AnimatePresence>
        {sosAlert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(244,63,94,0.3)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div initial={{ scale: 0.7, y: -30 }} animate={{ scale: 1, y: 0 }}
              className="glass" style={{ padding: 40, maxWidth: 440, width: "90%", textAlign: "center", border: "2px solid rgba(244,63,94,0.6)" }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ fontSize: 72, marginBottom: 16 }}>🆘</motion.div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 28, color: "#F43F5E", marginBottom: 8 }}>SOS ALERT</h2>
              <p style={{ color: "var(--vf-text-secondary)", fontSize: 14, marginBottom: 6 }}>Attendee triggered emergency</p>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 24 }}>📍 Section W18, Row 3 — West Stand</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setSosAlert(false)}
                  style={{ flex: 1, padding: "14px", background: "var(--vf-grad-danger)", color: "white", fontWeight: 800, fontSize: 15, borderRadius: 12, border: "none", cursor: "pointer" }}>
                  🚑 Dispatch Response
                </button>
                <button onClick={() => setSosAlert(false)}
                  style={{ flex: 1, padding: "14px", background: "var(--vf-bg-glass)", color: "var(--vf-text-secondary)", fontWeight: 600, fontSize: 14, borderRadius: 12, border: "1px solid var(--vf-border)", cursor: "pointer" }}>
                  View Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Security Operations</h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>Real-time incident management · SOS response · Evacuation control</p>
        </div>
        <button onClick={() => setEvacuationMode(!evacuationMode)}
          style={{ padding: "12px 24px", background: evacuationMode ? "var(--vf-grad-danger)" : "rgba(244,63,94,0.15)", color: evacuationMode ? "white" : "#F43F5E", fontWeight: 800, fontSize: 14, borderRadius: 12, border: evacuationMode ? "none" : "2px solid rgba(244,63,94,0.4)", cursor: "pointer" }}>
          {evacuationMode ? "🚨 EVACUATION MODE ACTIVE" : "⚠️ Activate Evacuation Mode"}
        </button>
      </div>

      {evacuationMode && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 20, padding: "16px 24px", background: "rgba(244,63,94,0.15)", border: "2px solid #F43F5E", borderRadius: 12, display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 32 }}>🚨</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#F43F5E", marginBottom: 4 }}>EVACUATION MODE ACTIVE</div>
            <div style={{ fontSize: 14, color: "var(--vf-text-secondary)" }}>Emergency exits illuminated · Public address activated · Security teams mobilized · Attendees receiving push notifications</div>
          </div>
        </motion.div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { icon: "🚨", label: "Open Incidents", value: openInc.length, color: "#F43F5E" },
          { icon: "⚡", label: "Critical Zones", value: criticalZones.length, color: "#F97316" },
          { icon: "👷", label: "Staff Deployed", value: staffData.length, color: "#3B7FFF" },
          { icon: "📡", label: "CCTV Online", value: isDemoMode ? "48/50" : "0/0", color: "#8B5CF6" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass" style={{ padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{kpi.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginTop: 4 }}>{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Incident list */}
        <div className="glass" style={{ padding: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Live Incidents</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {incidents.length > 0 ? incidents.map(inc => (
              <motion.div key={inc.id} layout onClick={() => setSelectedInc(selectedInc === inc.id ? null : inc.id)}
                style={{ padding: "14px 16px", borderRadius: 12, background: inc.status === "resolved" ? "rgba(255,255,255,0.02)" : "rgba(244,63,94,0.06)", border: `1px solid ${inc.status === "resolved" ? "var(--vf-border)" : `rgba(${SEV_COLOR[inc.severity].slice(1).match(/.{2}/g)!.map(h => parseInt(h, 16)).join(",")}, 0.3)`}`, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20 }}>{TYPE_ICON[inc.type]}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{inc.title}</div>
                      <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginTop: 2 }}>{inc.location} · {timeAgo(inc.timestamp)}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: SEV_COLOR[inc.severity], textTransform: "uppercase" }}>{inc.severity}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: inc.status === "resolved" ? "#10B981" : inc.status === "responding" ? "#F59E0B" : "#F43F5E", textTransform: "uppercase" }}>{inc.status}</span>
                  </div>
                </div>
                <AnimatePresence>
                  {selectedInc === inc.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--vf-border)" }}>
                      <p style={{ fontSize: 12, color: "var(--vf-text-secondary)", marginBottom: 8 }}>{inc.description}</p>
                      {inc.assignedTeam && <p style={{ fontSize: 11, color: "var(--vf-cyan)", marginBottom: 12 }}>👷 Assigned: {inc.assignedTeam}</p>}
                      <div style={{ display: "flex", gap: 8 }}>
                        {inc.status !== "resolved" && (
                          <button onClick={() => resolve(inc.id)}
                            style={{ padding: "8px 16px", background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                            ✅ Mark Resolved
                          </button>
                        )}
                        <button style={{ padding: "8px 16px", background: "rgba(0,212,255,0.1)", color: "var(--vf-cyan)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                          📡 Radio Team
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0" }}>No active incidents</div>}
          </div>
        </div>

        {/* Staff + Missing person */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Staff Status</h2>
            {staffData.length > 0 ? staffData.map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.status === "active" ? "#10B981" : s.status === "incident" ? "#F43F5E" : "#F59E0B" }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: "var(--vf-text-muted)" }}>{s.role} · {s.zone}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: s.status === "active" ? "#10B981" : s.status === "incident" ? "#F43F5E" : "#F59E0B", textTransform: "uppercase" }}>
                  {s.status}
                </span>
              </div>
            )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0" }}>No staff deployed</div>}
          </div>

          {isDemoMode && (
            <div className="glass" style={{ padding: 24, border: "1px solid rgba(245,158,11,0.3)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#F59E0B" }}>🔍 Missing Person Report</h2>
              <div style={{ fontSize: 13, color: "var(--vf-text-secondary)", lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, color: "var(--vf-text-primary)", marginBottom: 8 }}>Active Case #MP-2024-003</div>
                <div>👦 Child, ~8 years old</div>
                <div>👕 Blue cricket jersey, white shorts</div>
                <div>📍 Last seen: North Concourse, Gate A</div>
                <div>⏱️ Reported: 22 minutes ago</div>
                <div style={{ marginTop: 8, color: "var(--vf-amber)" }}>👮 Security Beta assigned</div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button style={{ flex: 1, padding: "10px", background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  📢 PA Announcement
                </button>
                <button style={{ flex: 1, padding: "10px", background: "rgba(0,212,255,0.1)", color: "var(--vf-cyan)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  📷 CCTV Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
