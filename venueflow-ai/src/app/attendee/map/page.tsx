"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CROWD_ZONES, getDensityColor, getDensityLabel, getOccupancyPercent } from "@/lib/mockData";
import { useDemoStore } from "@/lib/store/demoStore";

type Layer = "crowd" | "food" | "restroom" | "exits" | "accessibility";

const LAYER_CONFIG: Record<Layer, { label: string; icon: string; color: string }> = {
  crowd: { label: "Crowd Density", icon: "👥", color: "#F43F5E" },
  food: { label: "Food Stalls", icon: "🍔", color: "#F59E0B" },
  restroom: { label: "Restrooms", icon: "🚻", color: "#3B7FFF" },
  exits: { label: "Exits & Gates", icon: "🚪", color: "#10B981" },
  accessibility: { label: "Accessibility", icon: "♿", color: "#8B5CF6" },
};

const FOOD_POINTS = [
  { x: 175, y: 92, label: "Zap Burgers", wait: "51 min", busy: true },
  { x: 300, y: 92, label: "Hydration Hub", wait: "6 min", busy: false },
  { x: 460, y: 220, label: "Spice Bowl", wait: "10 min", busy: false },
  { x: 90, y: 220, label: "West Grills", wait: "60 min", busy: true },
  { x: 285, y: 380, label: "South Eats", wait: "5 min", busy: false },
];

const EXIT_POINTS = [
  { x: 270, y: 12, label: "Gate A", status: "high" },
  { x: 270, y: 438, label: "Gate B", status: "low" },
  { x: 516, y: 235, label: "Gate C", status: "medium" },
  { x: 44, y: 235, label: "Gate D", status: "critical" },
];

const RESTROOM_POINTS = [
  { x: 200, y: 105, label: "Block A", wait: "33 min" },
  { x: 350, y: 380, label: "Block B", wait: "4 min" },
  { x: 460, y: 150, label: "Block C", wait: "12 min" },
  { x: 90, y: 300, label: "Block D", wait: "25 min" },
];

const ACCESS_POINTS = [
  { x: 270, y: 440, label: "Accessible Entry", type: "entry" },
  { x: 90, y: 350, label: "Elevator W1", type: "elevator" },
  { x: 460, y: 350, label: "Elevator E1", type: "elevator" },
  { x: 200, y: 200, label: "Accessible Seating", type: "seat" },
];

export default function StadiumMapPage() {
  const { isDemoMode } = useDemoStore();
  const [activeLayer, setActiveLayer] = useState<Layer>("crowd");
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [myRoute, setMyRoute] = useState(false);

  const zonesData = isDemoMode ? CROWD_ZONES : [];
  const foodData = isDemoMode ? FOOD_POINTS : [];
  const exitData = isDemoMode ? EXIT_POINTS : [];
  const restroomData = isDemoMode ? RESTROOM_POINTS : [];
  const accessData = isDemoMode ? ACCESS_POINTS : [];

  const getExitColor = (status: string) => {
    if (status === "critical") return "#F43F5E";
    if (status === "high") return "#F97316";
    if (status === "medium") return "#F59E0B";
    return "#10B981";
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🗺️ Stadium Map</h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>National Stadium, Mumbai · Updated every 5 seconds</p>
        </div>
        <button onClick={() => setMyRoute(!myRoute)}
          style={{ background: myRoute ? "var(--vf-grad-cyan)" : "var(--vf-bg-glass)", color: myRoute ? "#050A14" : "var(--vf-text-primary)", border: "1px solid var(--vf-border)", fontWeight: 600, fontSize: 13, padding: "10px 20px", borderRadius: 10, cursor: "pointer" }}>
          {myRoute ? "✅ Route Active" : "🧭 Navigate to My Seat (N-23)"}
        </button>
      </div>

      {/* Layer toggles */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {(Object.keys(LAYER_CONFIG) as Layer[]).map(layer => (
          <button key={layer} onClick={() => setActiveLayer(layer)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1px solid", transition: "all 0.15s",
              background: activeLayer === layer ? `${LAYER_CONFIG[layer].color}20` : "var(--vf-bg-glass)",
              color: activeLayer === layer ? LAYER_CONFIG[layer].color : "var(--vf-text-secondary)",
              borderColor: activeLayer === layer ? `${LAYER_CONFIG[layer].color}50` : "var(--vf-border)" }}>
            {LAYER_CONFIG[layer].icon} {LAYER_CONFIG[layer].label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Stadium SVG Map */}
        <div className="glass" style={{ padding: 20, position: "relative" }}>
          <svg viewBox="0 0 560 460" style={{ width: "100%", height: "auto", borderRadius: 12 }}>
            {/* Background */}
            <rect width="560" height="460" fill="#060D1E" rx="12" />

            {/* Draw zones */}
            {zonesData.map(zone => (
              <g key={zone.id} className="map-zone"
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}>
                <rect
                  x={zone.x} y={zone.y} width={zone.width} height={zone.height}
                  rx={6}
                  fill={activeLayer === "crowd" && zone.id !== "pitch" ? getDensityColor(zone.density) : zone.id === "pitch" ? "#1a3a1a" : "rgba(255,255,255,0.06)"}
                  stroke={hoveredZone === zone.id ? "var(--vf-cyan)" : "rgba(255,255,255,0.1)"}
                  strokeWidth={hoveredZone === zone.id ? 2 : 1}
                />
                {zone.id === "pitch" && (
                  <>
                    <ellipse cx={280} cy={230} rx={60} ry={45} fill="none" stroke="#2a5a2a" strokeWidth={2} />
                    <rect x={240} y={185} width={80} height={90} fill="none" stroke="#2a5a2a" strokeWidth={1.5} />
                    <circle cx={280} cy={230} r={4} fill="#3a6a3a" />
                    <line x1={280} y1={110} x2={280} y2={350} stroke="#2a5a2a" strokeWidth={1} />
                  </>
                )}
                {zone.id !== "pitch" && zone.id !== "concourse-n" && zone.id !== "concourse-s" && (
                  <text x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 + 4}
                    textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={zone.width > 60 ? 10 : 8} fontWeight="600" fontFamily="Inter,sans-serif">
                    {zone.name.split(" ").slice(0, 2).join(" ")}
                  </text>
                )}
              </g>
            ))}

            {/* Food layer */}
            {activeLayer === "food" && foodData.map(f => (
              <g key={f.label}>
                <circle cx={f.x} cy={f.y} r={14} fill={f.busy ? "rgba(245,158,11,0.9)" : "rgba(16,185,129,0.9)"} stroke="white" strokeWidth={1.5} />
                <text x={f.x} y={f.y + 4} textAnchor="middle" fill="white" fontSize={12}>🍔</text>
                <rect x={f.x - 35} y={f.y + 16} width={70} height={18} rx={4} fill="rgba(8,14,30,0.9)" />
                <text x={f.x} y={f.y + 28} textAnchor="middle" fill={f.busy ? "#F59E0B" : "#10B981"} fontSize={9} fontWeight="700">{f.wait}</text>
              </g>
            ))}

            {/* Exits layer */}
            {activeLayer === "exits" && exitData.map(e => (
              <g key={e.label}>
                <circle cx={e.x} cy={e.y} r={16} fill={getExitColor(e.status)} stroke="white" strokeWidth={2} />
                <text x={e.x} y={e.y + 5} textAnchor="middle" fill="white" fontSize={14}>🚪</text>
                <text x={e.x} y={e.y + 28} textAnchor="middle" fill="white" fontSize={9} fontWeight="600">{e.label}</text>
              </g>
            ))}

            {/* Restroom layer */}
            {activeLayer === "restroom" && restroomData.map(r => (
              <g key={r.label}>
                <circle cx={r.x} cy={r.y} r={13} fill="rgba(59,127,255,0.9)" stroke="white" strokeWidth={1.5} />
                <text x={r.x} y={r.y + 4} textAnchor="middle" fill="white" fontSize={11}>🚻</text>
                <text x={r.x} y={r.y + 24} textAnchor="middle" fill="#3B7FFF" fontSize={9} fontWeight="700">{r.wait}</text>
              </g>
            ))}

            {/* Accessibility layer */}
            {activeLayer === "accessibility" && accessData.map(a => (
              <g key={a.label}>
                <circle cx={a.x} cy={a.y} r={13} fill="rgba(139,92,246,0.9)" stroke="white" strokeWidth={1.5} />
                <text x={a.x} y={a.y + 4} textAnchor="middle" fill="white" fontSize={10}>♿</text>
              </g>
            ))}

            {/* My seat marker */}
            {myRoute && isDemoMode && (
              <g>
                <circle cx={220} cy={55} r={10} fill="#00D4FF" stroke="white" strokeWidth={2} />
                <text x={220} y={59} textAnchor="middle" fill="white" fontSize={12}>📍</text>
                <line x1={280} y1={32} x2={220} y2={52} stroke="#00D4FF" strokeWidth={2} strokeDasharray="4,3" />
                <text x={220} y={46} textAnchor="middle" fill="#00D4FF" fontSize={9} fontWeight="700">N-23 G14</text>
              </g>
            )}
          </svg>

          {/* Legend */}
          {activeLayer === "crowd" && (
            <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              {["low", "medium", "high", "critical"].map(d => (
                <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: getDensityColor(d as any) }} />
                  <span style={{ color: "var(--vf-text-secondary)", textTransform: "capitalize" }}>{d}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone detail panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {hoveredZone ? (
            <motion.div key={hoveredZone} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="glass" style={{ padding: 20 }}>
              {(() => {
                const zone = zonesData.find(z => z.id === hoveredZone);
                if (!zone) return null;
                return (
                  <>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 8 }}>{zone.name}</h3>
                    <div style={{ fontSize: 13, color: "var(--vf-text-secondary)", marginBottom: 12 }}>
                      {zone.current.toLocaleString()} / {zone.capacity.toLocaleString()} attendees
                    </div>
                    <div className="progress-bar-track" style={{ height: 8, marginBottom: 8 }}>
                      <div className="progress-bar-fill" style={{ width: `${getOccupancyPercent(zone)}%`, background: getDensityColor(zone.density) }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "var(--vf-text-muted)" }}>{getOccupancyPercent(zone)}% full</span>
                      <span style={{ fontWeight: 700, color: getDensityColor(zone.density).replace("0.55", "1").replace("0.6", "1").replace("0.7", "1") }}>
                        {getDensityLabel(zone.density)}
                      </span>
                    </div>
                    {zone.density === "critical" || zone.density === "high" ? (
                      <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(244,63,94,0.1)", borderRadius: 8, fontSize: 12, color: "#F43F5E", border: "1px solid rgba(244,63,94,0.25)" }}>
                        ⚠️ High congestion. Use an alternative zone or wait for crowd to disperse.
                      </div>
                    ) : (
                      <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(16,185,129,0.1)", borderRadius: 8, fontSize: 12, color: "#10B981", border: "1px solid rgba(16,185,129,0.25)" }}>
                        ✅ Comfortable capacity. Safe to enter.
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          ) : (
            <div className="glass" style={{ padding: 20, textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13 }}>
              Hover over a zone to see details
            </div>
          )}

          {isDemoMode && (
            <div className="glass" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>🚨 AI Route Suggestions</h3>
              {[
                { route: "Gate A → Section N-23", time: "4 min", congestion: "high", alt: false },
                { route: "Gate A → Elevator W1 → N-23", time: "6 min", congestion: "low", alt: true },
                { route: "Gate C → Bridge → N-23", time: "8 min", congestion: "low", alt: true },
              ].map((r, i) => (
                <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--vf-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: r.alt ? "var(--vf-text-secondary)" : "var(--vf-text-primary)" }}>{r.route}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--vf-cyan)" }}>{r.time}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div className="progress-bar-track" style={{ height: 4, flex: 1 }}>
                      <div className="progress-bar-fill" style={{ width: r.congestion === "high" ? "80%" : "25%", background: r.congestion === "high" ? "#F43F5E" : "#10B981" }} />
                    </div>
                    <span style={{ fontSize: 10, color: r.congestion === "high" ? "#F43F5E" : "#10B981", fontWeight: 700 }}>{r.congestion}</span>
                    {r.alt && <span className="status-badge status-info" style={{ fontSize: 9 }}>ALT</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="glass" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>♿ Accessibility</h3>
            <div style={{ fontSize: 13, color: "var(--vf-text-secondary)", lineHeight: 1.6 }}>
              <div style={{ marginBottom: 8 }}>✅ Wheelchair ramps: All gates</div>
              <div style={{ marginBottom: 8 }}>✅ Elevators: W1, W2, E1, E2</div>
              <div style={{ marginBottom: 8 }}>✅ Accessible seating: Sections A1-A4</div>
              <div>♿ Accessible entry: Gate B (shortest path)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
