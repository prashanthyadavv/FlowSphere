"use client";
import { PARKING_ZONES } from "@/lib/mockData";
import { motion } from "framer-motion";
import { useDemoStore } from "@/lib/store/demoStore";

const typeIcon: Record<string, string> = { general: "🅿️", vip: "⭐", accessible: "♿", ev: "⚡" };
const statusColor: Record<string, string> = { available: "#10B981", filling: "#F59E0B", full: "#F43F5E" };

export default function ParkingPage() {
  const { isDemoMode } = useDemoStore();
  const parkingData = isDemoMode ? PARKING_ZONES : [];

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🅿️ Smart Parking</h1>
        <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>Real-time space availability · Smart exit routing · Shuttle tracking</p>
      </div>

      {/* AI Exit Alert */}
      {isDemoMode && (
        <div className="glass" style={{ padding: "16px 20px", marginBottom: 20, borderLeft: "3px solid var(--vf-amber)", background: "rgba(245,158,11,0.05)", display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 24 }}>🚦</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: "var(--vf-amber)" }}>Post-Match Traffic Alert</div>
            <div style={{ fontSize: 13, color: "var(--vf-text-secondary)" }}>
              AI predicts heavy traffic via Gate D after full time. Recommended: <strong style={{ color: "var(--vf-text-primary)" }}>Exit via Gate B → Zone Beta (East)</strong>. Saves ~25 min.
            </div>
          </div>
        </div>
      )}

      {/* Parking zones grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
        {parkingData.length > 0 ? parkingData.map((zone, i) => {
          const fillPct = Math.round(((zone.totalSpaces - zone.availableSpaces) / zone.totalSpaces) * 100);
          return (
            <motion.div key={zone.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass card-hover" style={{ padding: 20, opacity: zone.status === "full" ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{typeIcon[zone.type]}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{zone.name}</div>
                  <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginTop: 2 }}>{zone.type.toUpperCase()} · {zone.distance} · {zone.walkTime} walk</div>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: statusColor[zone.status], textAlign: "right", fontFamily: "var(--font-display)" }}>
                    {zone.availableSpaces}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--vf-text-muted)", textAlign: "right" }}>spaces left</div>
                </div>
              </div>

              <div className="progress-bar-track" style={{ height: 8, marginBottom: 10 }}>
                <div className="progress-bar-fill" style={{ width: `${fillPct}%`, background: statusColor[zone.status] }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 14 }}>
                <span style={{ color: "var(--vf-text-muted)" }}>{fillPct}% occupied</span>
                <span style={{ fontWeight: 700, color: statusColor[zone.status] }}>{zone.status.toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--vf-cyan)" }}>{zone.price}</span>
                <button disabled={zone.status === "full"}
                  style={{ padding: "8px 16px", background: zone.status === "full" ? "var(--vf-bg-glass)" : "rgba(0,212,255,0.15)", color: zone.status === "full" ? "var(--vf-text-muted)" : "var(--vf-cyan)", border: `1px solid ${zone.status === "full" ? "var(--vf-border)" : "rgba(0,212,255,0.4)"}`, borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: zone.status === "full" ? "not-allowed" : "pointer" }}>
                  {zone.status === "full" ? "Full" : "Navigate →"}
                </button>
              </div>
            </motion.div>
          );
        }) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "40px 0", gridColumn: "1 / -1" }}>No parking zones available</div>}
      </div>

      {/* Shuttle tracker */}
      {isDemoMode && (
        <div className="glass" style={{ padding: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🚌 Shuttle & Transport</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { route: "Shuttle A — Parking ↔ Gate A", eta: "3 min", capacity: "12 seats left", status: "on-time" },
            { route: "Shuttle B — Metro Station ↔ Gate B", eta: "8 min", capacity: "23 seats left", status: "on-time" },
            { route: "Ride-Share Drop Zone — West Gate", eta: "Now", capacity: "Active zone", status: "active" },
            { route: "Bus Route 47 — City Centre", eta: "15 min", capacity: "Standing room", status: "delayed" },
          ].map((s, i) => (
            <div key={i} className="glass" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{s.route}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "var(--vf-text-muted)" }}>{s.capacity}</span>
                <span style={{ fontWeight: 700, color: s.status === "delayed" ? "#F59E0B" : "#10B981" }}>ETA: {s.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
