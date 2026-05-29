"use client";
import { motion } from "framer-motion";
import { MY_SEAT, MATCH_STATS } from "@/lib/mockData";

export default function TicketPage() {
  const qrData = "VF-TKT-2024-MUMB-N23G14-8X4K2";
  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 24 }}>🎫 My Ticket</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <motion.div className="glass" style={{ padding: 28, borderTop: "3px solid var(--vf-cyan)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="status-badge status-live" style={{ marginBottom: 16, display: "inline-flex" }}>
            <span className="pulse-dot pulse-dot-green" />VALID TICKET
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>{MATCH_STATS.homeTeam}</h2>
          <div style={{ fontSize: 16, color: "var(--vf-text-secondary)", marginBottom: 20 }}>vs {MATCH_STATS.awayTeam}</div>

          {[
            { label: "Section", value: MY_SEAT.section },
            { label: "Row", value: MY_SEAT.row },
            { label: "Seat", value: MY_SEAT.seat },
            { label: "Entry Gate", value: MY_SEAT.gate },
            { label: "Level", value: MY_SEAT.level },
            { label: "View", value: MY_SEAT.view },
          ].map(f => (
            <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--vf-border)" }}>
              <span style={{ fontSize: 13, color: "var(--vf-text-muted)" }}>{f.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{f.value}</span>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>TICKET ID</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--vf-cyan)", background: "rgba(0,212,255,0.08)", padding: "8px 12px", borderRadius: 8 }}>{qrData}</div>
          </div>
        </motion.div>

        <motion.div className="glass" style={{ padding: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Simulated QR Code using SVG */}
          <svg viewBox="0 0 200 200" style={{ width: 180, height: 180, marginBottom: 20 }}>
            <rect width="200" height="200" fill="#0A1628" rx="12" />
            {/* QR pattern simulation */}
            {Array.from({ length: 20 }).map((_, r) =>
              Array.from({ length: 20 }).map((_, c) => {
                const seed = (r * 20 + c) * 7 + r * 3 + c;
                const fill = (seed % 3 === 0 || seed % 7 === 0) ? "#00D4FF" : "#0A1628";
                // Corner squares
                const isCorner = (r < 4 && c < 4) || (r < 4 && c > 15) || (r > 15 && c < 4);
                return (
                  <rect key={`${r}-${c}`}
                    x={6 + c * 9.4} y={6 + r * 9.4} width={8} height={8} rx={1}
                    fill={isCorner ? "#00D4FF" : fill} />
                );
              })
            )}
            {/* Corner markers */}
            <rect x={6} y={6} width={34} height={34} rx={4} fill="none" stroke="#00D4FF" strokeWidth={3} />
            <rect x={160} y={6} width={34} height={34} rx={4} fill="none" stroke="#00D4FF" strokeWidth={3} />
            <rect x={6} y={160} width={34} height={34} rx={4} fill="none" stroke="#00D4FF" strokeWidth={3} />
            <rect x={14} y={14} width={18} height={18} rx={2} fill="#00D4FF" />
            <rect x={168} y={14} width={18} height={18} rx={2} fill="#00D4FF" />
            <rect x={14} y={168} width={18} height={18} rx={2} fill="#00D4FF" />
          </svg>

          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Scan at Entry Gate</div>
          <div style={{ fontSize: 12, color: "var(--vf-text-muted)", textAlign: "center", marginBottom: 20 }}>
            NFC tap or QR scan · Anti-fraud verified
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            <button style={{ padding: "12px", background: "var(--vf-grad-cyan)", color: "#050A14", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer" }}>
              📲 Add to Digital Wallet
            </button>
            <button style={{ padding: "12px", background: "rgba(139,92,246,0.15)", color: "#8B5CF6", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "1px solid rgba(139,92,246,0.3)", cursor: "pointer" }}>
              ⭐ Request Seat Upgrade
            </button>
          </div>
        </motion.div>
      </div>

      {/* Gate directions */}
      <motion.div className="glass" style={{ marginTop: 20, padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🧭 Getting to Your Seat</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {["Arrive at Gate A (North entrance)", "Scan QR / NFC at turnstile", "Take stairs/elevator to Upper Tier", "Follow signs to Section N-23", "Row G · Seat 14 · Central view"].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "var(--vf-bg-glass)", borderRadius: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--vf-grad-cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#050A14", flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: "var(--vf-text-secondary)", lineHeight: 1.4 }}>{step}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
