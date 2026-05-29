"use client";
import { CROWD_ZONES, CROWD_TIMELINE, AI_PREDICTIONS, getDensityColor, getDensityLabel, getOccupancyPercent } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDemoStore } from "@/lib/store/demoStore";

export default function CrowdAnalyticsPage() {
  const { isDemoMode } = useDemoStore();
  const timelineData = isDemoMode ? CROWD_TIMELINE.slice(8, 22) : [];
  const predictionsData = isDemoMode ? AI_PREDICTIONS : [];
  const zonesData = isDemoMode ? CROWD_ZONES : [];

  return (
    <div style={{ maxWidth: 1400 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 24 }}>👥 Crowd Analytics</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Attendance Flow (Today)</h2>
            <span className="status-badge status-live"><span className="pulse-dot pulse-dot-green" />Live</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            {timelineData.length > 0 ? (
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="gCrowd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B7FFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B7FFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "#0D1426", border: "1px solid #1a2540", borderRadius: 8, fontSize: 11, color: "#F0F4FF" }} formatter={(v: any) => [Number(v).toLocaleString(), ""]} />
                <Area type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={1.5} fill="url(#gPred)" strokeDasharray="4 3" dot={false} name="Predicted" />
                <Area type="monotone" dataKey="attendees" stroke="#3B7FFF" strokeWidth={2} fill="url(#gCrowd)" dot={false} name="Actual" />
              </AreaChart>
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vf-text-muted)", fontSize: 13 }}>No active operations</div>
            )}
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ padding: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🤖 AI Crowd Alerts</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {predictionsData.length > 0 ? predictionsData.map((pred, i) => (
              <div key={i} style={{ padding: "12px 14px", background: "rgba(244,63,94,0.08)", borderRadius: 10, border: "1px solid rgba(244,63,94,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{pred.zone}</span>
                  <span style={{ fontSize: 11, color: "#F43F5E", fontWeight: 700 }}>~{pred.timeToAction}</span>
                </div>
                <div className="progress-bar-track" style={{ height: 4, marginBottom: 6 }}>
                  <div className="progress-bar-fill" style={{ width: `${pred.predictedPeak}%`, background: pred.predictedPeak > 95 ? "#F43F5E" : "#F59E0B" }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--vf-text-muted)" }}>→ {pred.action}</div>
              </div>
            )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0" }}>No alerts</div>}
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Zone Status Map</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {zonesData.length > 0 ? zonesData.filter(z => z.id !== "pitch").map(zone => (
            <div key={zone.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{zone.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: getDensityColor(zone.density).replace("0.55", "1").replace("0.6", "1").replace("0.7", "1") }}>
                  {getDensityLabel(zone.density)} {zone.trend === "up" ? "↑" : zone.trend === "down" ? "↓" : "→"}
                </span>
              </div>
              <div className="progress-bar-track" style={{ height: 8 }}>
                <div className="progress-bar-fill" style={{ width: `${getOccupancyPercent(zone)}%`, background: getDensityColor(zone.density) }} />
              </div>
              <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginTop: 4 }}>
                {zone.current.toLocaleString()} / {zone.capacity.toLocaleString()} capacity
              </div>
            </div>
          )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0", gridColumn: "1 / -1" }}>No zone data available</div>}
        </div>
      </div>
    </div>
  );
}
