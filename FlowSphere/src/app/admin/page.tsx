"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CROWD_ZONES, INCIDENTS, STAFF_MEMBERS, GATE_THROUGHPUT, AI_PREDICTIONS,
  CROWD_TIMELINE, getDensityColor, getDensityLabel, getOccupancyPercent, timeAgo,
} from "@/lib/mockData";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { useDemoStore } from "@/lib/store/demoStore";

export default function AdminOverview() {
  const { isDemoMode } = useDemoStore();
  const [liveAttendees, setLiveAttendees] = useState(isDemoMode ? 52847 : 0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!isDemoMode) {
      setLiveAttendees(0);
      return;
    }
    setLiveAttendees(52847);
    const t = setInterval(() => {
      setLiveAttendees(p => Math.max(40000, p + Math.round((Math.random() - 0.4) * 30)));
      setTime(new Date());
    }, 3000);
    return () => clearInterval(t);
  }, [isDemoMode]);

  const criticalZones = isDemoMode ? CROWD_ZONES.filter(z => z.density === "critical") : [];
  const incidentsData = isDemoMode ? INCIDENTS : [];
  const openIncidents = incidentsData.filter(i => i.status !== "resolved");
  const staffActive = isDemoMode ? STAFF_MEMBERS.filter(s => s.status === "active").length : 0;
  const staffTotal = isDemoMode ? STAFF_MEMBERS.length : 0;
  const gateThroughput = isDemoMode ? "94.6%" : "0%";
  const timelineData = isDemoMode ? CROWD_TIMELINE.slice(8, 22) : [];
  const predictionsData = isDemoMode ? AI_PREDICTIONS : [];
  const crowdZonesData = isDemoMode ? CROWD_ZONES : [];
  return (
    <div style={{ maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Admin Control Center</h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>
            National Stadium, Mumbai · {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {criticalZones.length > 0 && (
            <div className="status-badge status-danger" style={{ fontSize: 13, padding: "8px 14px" }}>
              <span className="pulse-dot pulse-dot-red" />
              {criticalZones.length} Critical Zone{criticalZones.length > 1 ? "s" : ""}
            </div>
          )}
          <div className="status-badge status-live" style={{ fontSize: 13, padding: "8px 14px" }}>
            <span className="pulse-dot pulse-dot-green" />
            All Systems Operational
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { icon: "👥", label: "Live Attendees", value: liveAttendees.toLocaleString(), sub: "of 60,000 cap", color: "#3B7FFF", pulse: true },
          { icon: "🚨", label: "Open Incidents", value: openIncidents.length, sub: "need response", color: "#F43F5E", pulse: openIncidents.length > 0 },
          { icon: "⚠️", label: "Critical Zones", value: criticalZones.length, sub: "approaching max", color: "#F97316", pulse: criticalZones.length > 0 },
          { icon: "👷", label: "Staff Active", value: staffActive, sub: `of ${staffTotal} deployed`, color: "#10B981", pulse: false },
          { icon: "🎫", label: "Gates Throughput", value: gateThroughput, sub: "avg scan rate", color: "#00D4FF", pulse: false },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass" style={{ padding: "18px 16px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{kpi.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: kpi.color, display: "flex", alignItems: "center", gap: 8 }}>
              {kpi.value}
              {kpi.pulse && <span className={`pulse-dot pulse-dot-${kpi.color === "#F43F5E" || kpi.color === "#F97316" ? "red" : "green"}`} />}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--vf-text-primary)", marginTop: 4 }}>{kpi.label}</div>
            <div style={{ fontSize: 10, color: "var(--vf-text-muted)", marginTop: 2 }}>{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Crowd Timeline + AI Predictions */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Attendance Flow (Today)</h2>
            <span className="status-badge status-live"><span className="pulse-dot pulse-dot-green" />Live</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
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
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vf-text-muted)", fontSize: 13 }}>No data available</div>
            )}
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ padding: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🤖 AI Alerts</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
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
            )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0" }}>No predictions</div>}
          </div>
        </div>
      </div>

      {/* Row 2: Zones + Incidents */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Zone statuses */}
        <div className="glass" style={{ padding: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Zone Status</h2>
          {crowdZonesData.filter(z => z.id !== "pitch" && !z.id.startsWith("concourse") && !z.id.startsWith("gate")).map(zone => (
            <div key={zone.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{zone.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: getDensityColor(zone.density).replace("0.55", "1").replace("0.6", "1").replace("0.7", "1") }}>
                  {getDensityLabel(zone.density)} {zone.trend === "up" ? "↑" : zone.trend === "down" ? "↓" : "→"}
                </span>
              </div>
              <div className="progress-bar-track" style={{ height: 5 }}>
                <div className="progress-bar-fill" style={{ width: `${getOccupancyPercent(zone)}%`, background: getDensityColor(zone.density) }} />
              </div>
            </div>
          ))}
        </div>

        {/* Live incidents */}
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Live Incidents</h2>
            <span style={{ fontSize: 11, background: "rgba(244,63,94,0.15)", color: "#F43F5E", padding: "3px 10px", borderRadius: 100, fontWeight: 700 }}>{openIncidents.length} Open</span>
          </div>
          {incidentsData.length > 0 ? incidentsData.map(inc => (
            <div key={inc.id} style={{ padding: "10px 12px", marginBottom: 8, borderRadius: 10, background: inc.status === "resolved" ? "rgba(255,255,255,0.02)" : "rgba(244,63,94,0.06)", border: `1px solid ${inc.status === "resolved" ? "var(--vf-border)" : "rgba(244,63,94,0.2)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{inc.title}</span>
                <span style={{ fontSize: 10, color: inc.severity === "critical" ? "#F43F5E" : inc.severity === "high" ? "#F97316" : inc.severity === "medium" ? "#F59E0B" : "#10B981", fontWeight: 700, textTransform: "uppercase" }}>{inc.severity}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--vf-text-muted)" }}>{inc.location} · {timeAgo(inc.timestamp)}</div>
              <div style={{ fontSize: 11, color: inc.status === "resolved" ? "#10B981" : "#F59E0B", fontWeight: 600, marginTop: 4, textTransform: "uppercase" }}>{inc.status}</div>
            </div>
          )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0" }}>No incidents</div>}
        </div>


      </div>

      {/* Gate throughput */}
      <div className="glass" style={{ padding: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Gate Operations & Throughput</h2>
        {isDemoMode ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {GATE_THROUGHPUT.map(g => (
              <div key={g.gate} style={{ textAlign: "center", padding: "20px 16px", background: "var(--vf-bg-glass)", borderRadius: 12, border: "1px solid var(--vf-border)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: g.rate > 90 ? "#10B981" : "#F59E0B" }}>{g.rate}%</div>
                <div style={{ fontWeight: 700, fontSize: 14, margin: "6px 0 4px" }}>{g.gate}</div>
                <div style={{ fontSize: 12, color: "var(--vf-text-muted)" }}>{g.scanned.toLocaleString()} / {g.expected.toLocaleString()}</div>
                <div className="progress-bar-track" style={{ height: 4, marginTop: 10 }}>
                  <div className="progress-bar-fill" style={{ width: `${g.rate}%`, background: g.rate > 90 ? "#10B981" : "#F59E0B" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0" }}>No active operations</div>
        )}
      </div>
    </div>
  );
}
