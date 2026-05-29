"use client";
import { INCIDENTS, timeAgo } from "@/lib/mockData";
import { useDemoStore } from "@/lib/store/demoStore";

export default function IncidentsPage() {
  const { isDemoMode } = useDemoStore();
  const openIncidents = isDemoMode ? INCIDENTS.filter(i => i.status !== "resolved") : [];
  const resolvedIncidents = isDemoMode ? INCIDENTS.filter(i => i.status === "resolved") : [];

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🚨 Incident Management</h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>{openIncidents.length} active incidents requiring attention</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Open Incidents</h2>
          {openIncidents.length > 0 ? openIncidents.map(inc => (
            <div key={inc.id} className="glass" style={{ padding: "16px", marginBottom: 12, borderRadius: 10, borderLeft: `4px solid ${inc.severity === "critical" ? "#F43F5E" : inc.severity === "high" ? "#F97316" : inc.severity === "medium" ? "#F59E0B" : "#10B981"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{inc.title}</span>
                <span style={{ fontSize: 12, color: inc.severity === "critical" ? "#F43F5E" : inc.severity === "high" ? "#F97316" : inc.severity === "medium" ? "#F59E0B" : "#10B981", fontWeight: 700, textTransform: "uppercase" }}>{inc.severity} SEVERITY</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--vf-text-primary)", marginBottom: 8 }}>{inc.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--vf-text-muted)" }}>
                <span>📍 {inc.location} ({inc.zone})</span>
                <span>⏱️ {timeAgo(inc.timestamp)}</span>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                <span style={{ padding: "4px 10px", background: "rgba(245,158,11,0.1)", color: "#F59E0B", borderRadius: 6, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Status: {inc.status}</span>
                {inc.assignedTeam && <span style={{ padding: "4px 10px", background: "rgba(139,92,246,0.1)", color: "#8B5CF6", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Team: {inc.assignedTeam}</span>}
              </div>
            </div>
          )) : (
            <div className="glass" style={{ padding: 32, textAlign: "center", color: "var(--vf-text-muted)" }}>
              <span style={{ fontSize: 32 }}>✅</span>
              <p style={{ marginTop: 8 }}>No open incidents.</p>
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Recently Resolved</h2>
          {resolvedIncidents.map(inc => (
            <div key={inc.id} style={{ padding: "12px", marginBottom: 8, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--vf-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{inc.title}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--vf-text-muted)" }}>{inc.location} · {timeAgo(inc.timestamp)}</div>
              <div style={{ fontSize: 11, color: "#10B981", fontWeight: 700, marginTop: 4, textTransform: "uppercase" }}>{inc.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
