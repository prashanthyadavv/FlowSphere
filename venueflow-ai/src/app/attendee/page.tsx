"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  CROWD_ZONES, QUEUES, MATCH_STATS, NOTIFICATIONS, MY_SEAT,
  getDensityColor, getDensityLabel, getOccupancyPercent, formatWait, timeAgo,
} from "@/lib/mockData";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { useDemoStore } from "@/lib/store/demoStore";
import { useDataStore } from "@/lib/store/dataStore";

const MINI_CHART = Array.from({ length: 20 }, (_, i) => ({ v: 40 + Math.sin(i * 0.5) * 20 + Math.random() * 10 }));

export default function AttendeeDashboard() {
  const [time, setTime] = useState(new Date());
  const [crowdPulse, setCrowdPulse] = useState(52847);

  const { isDemoMode } = useDemoStore();
  const { zones: storedZones, vendors: storedVendors } = useDataStore();

  useEffect(() => {
    if (!isDemoMode) {
      setCrowdPulse(0);
      return;
    }
    const t = setInterval(() => {
      setTime(new Date());
      setCrowdPulse(p => p + Math.round((Math.random() - 0.45) * 20));
    }, 3000);
    return () => clearInterval(t);
  }, [isDemoMode]);

  const notificationsData = isDemoMode ? NOTIFICATIONS : [];
  const unreadNotifs = notificationsData.filter(n => !n.read).length;
  
  const crowdZonesData = isDemoMode ? CROWD_ZONES : storedZones.map(z => ({
    id: z.id, name: z.name, capacity: z.capacity, current: 0, density: "comfortable" as any, trend: "stable" as any
  }));
  const criticalZones = crowdZonesData.filter(z => z.density === "critical" || z.density === "high");

  const queuesData = isDemoMode ? QUEUES : storedVendors.map(v => ({
    id: v.id, vendorName: v.name, vendorType: v.type, zone: v.id, status: "open" as any, estimatedWait: 0, currentQueue: 0, queueTrend: "stable" as any
  }));
  const busyQueues = queuesData.filter(q => q.status === "busy");

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Welcome row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            Welcome back! 👋
          </h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>
            {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} · {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/attendee/map" style={{ textDecoration: "none", background: "var(--vf-grad-cyan)", color: "#050A14", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 6 }}>
            🗺️ Navigate to Seat
          </Link>
          <Link href="/attendee/queues" style={{ textDecoration: "none", background: "var(--vf-bg-glass)", color: "var(--vf-text-primary)", fontWeight: 600, fontSize: 13, padding: "10px 20px", borderRadius: 10, border: "1px solid var(--vf-border)", backdropFilter: "blur(10px)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            🍔 Order Food
          </Link>
        </div>
      </div>

      {isDemoMode && (
        <motion.div className="glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: "20px 24px", marginBottom: 24, borderLeft: "3px solid var(--vf-cyan)", background: "rgba(0,212,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span className="status-badge status-live"><span className="pulse-dot pulse-dot-green" />LIVE · {MATCH_STATS.minute}&apos;</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>{MATCH_STATS.homeTeam}</span>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, color: "var(--vf-cyan)" }}>
                  {MATCH_STATS.homeScore} – {MATCH_STATS.awayScore}
                </div>
                <div style={{ fontSize: 10, color: "var(--vf-text-muted)", fontWeight: 600 }}>{MATCH_STATS.period}</div>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>{MATCH_STATS.awayTeam}</span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--vf-text-secondary)" }}>
              <span>⚽ Shots: {MATCH_STATS.homeShots}–{MATCH_STATS.awayShots}</span>
              <span>⬛ Cards: {MATCH_STATS.homeYellowCards}–{MATCH_STATS.awayYellowCards}</span>
              <span>🎯 Possession: {MATCH_STATS.homePossession}%</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPI CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { icon: "👥", label: "Attendees Online", value: crowdPulse.toLocaleString(), sub: "of 60,000 capacity", color: "#3B7FFF" },
          { icon: "🚨", label: "Active Alerts", value: `${criticalZones.length}`, sub: "zones need attention", color: "#F43F5E" },
          { icon: "⏱️", label: "Shortest Food Queue", value: isDemoMode ? formatWait(Math.min(...QUEUES.filter(q => q.vendorType === "food").map(q => q.estimatedWait))) : "0 mins", sub: "Est. wait", color: "#10B981" },
          { icon: "🔔", label: "Unread Alerts", value: `${unreadNotifs}`, sub: "for you right now", color: "#F59E0B" },
          { icon: "🅿️", label: "Your Parking", value: isDemoMode ? "Zone Alpha" : "None", sub: isDemoMode ? "87 spaces remaining" : "-", color: "#8B5CF6" },
          { icon: "🎫", label: "My Seat", value: isDemoMode ? `${MY_SEAT.section} · ${MY_SEAT.row}${MY_SEAT.seat}` : "-", sub: isDemoMode ? `${MY_SEAT.level} · ${MY_SEAT.gate}` : "-", color: "#00D4FF" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass card-hover" style={{ padding: "20px 20px" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{kpi.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--vf-text-primary)", marginTop: 4 }}>{kpi.label}</div>
            <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginTop: 2 }}>{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Crowd Density Summary */}
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Zone Crowd Levels</h2>
            <Link href="/attendee/map" style={{ fontSize: 12, color: "var(--vf-cyan)", textDecoration: "none" }}>View Map →</Link>
          </div>
          {crowdZonesData.length > 0 ? crowdZonesData.filter(z => z.id !== "pitch" && !z.id.startsWith("concourse") && !z.id.startsWith("gate")).map(zone => (
            <div key={zone.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{zone.name}</span>
                <span style={{ fontSize: 12, color: "var(--vf-text-muted)" }}>{zone.current.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
              </div>
              <div className="progress-bar-track" style={{ height: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${getOccupancyPercent(zone as any)}%`, background: getDensityColor(zone.density as any) }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                <span style={{ fontSize: 11, color: "var(--vf-text-muted)" }}>{getOccupancyPercent(zone as any)}% full</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: getDensityColor(zone.density as any).replace("0.55", "1").replace("0.6", "1").replace("0.7", "1") }}>
                  {getDensityLabel(zone.density as any)} {zone.trend === "up" ? "↑" : zone.trend === "down" ? "↓" : "→"}
                </span>
              </div>
            </div>
          )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0" }}>No zones found</div>}
        </div>

        {/* Queue summary + Notifications */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass" style={{ padding: 24, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Nearest Food Queues</h2>
              <Link href="/attendee/queues" style={{ fontSize: 12, color: "var(--vf-cyan)", textDecoration: "none" }}>All queues →</Link>
            </div>
            {queuesData.length > 0 ? queuesData.filter(q => q.vendorType !== "restroom").slice(0, 4).map(q => (
              <div key={q.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--vf-border)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{q.vendorName}</div>
                  <div style={{ fontSize: 11, color: "var(--vf-text-muted)" }}>{q.zone}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: q.estimatedWait > 30 ? "var(--vf-rose)" : q.estimatedWait > 15 ? "var(--vf-amber)" : "var(--vf-emerald)" }}>
                    {formatWait(q.estimatedWait)}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--vf-text-muted)" }}>{q.currentQueue} in queue</div>
                </div>
              </div>
            )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0" }}>No vendors found</div>}
          </div>

          <div className="glass" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Latest Alerts</h2>
              <span className="status-badge status-warning">{unreadNotifs} new</span>
            </div>
            {notificationsData.length > 0 ? notificationsData.slice(0, 3).map(n => (
              <div key={n.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 20 }}>{n.type === "warning" ? "⚠️" : n.type === "success" ? "✅" : n.type === "promo" ? "⭐" : "ℹ️"}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: n.read ? "var(--vf-text-secondary)" : "var(--vf-text-primary)" }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginTop: 2 }}>{n.message.substring(0, 60)}...</div>
                  <div style={{ fontSize: 10, color: "var(--vf-text-muted)", marginTop: 4 }}>{timeAgo(n.timestamp)}</div>
                </div>
                {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--vf-cyan)", flexShrink: 0, marginTop: 4 }} />}
              </div>
            )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0" }}>No alerts</div>}
          </div>
        </div>
      </div>

      {/* Attendee crowd trend chart */}
      <div className="glass" style={{ padding: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Venue Attendance Trend (Today)</h2>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={MINI_CHART}>
            <defs>
              <linearGradient id="gAttend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#00D4FF" strokeWidth={2} fill="url(#gAttend)" dot={false} />
            <Tooltip contentStyle={{ background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 8, fontSize: 11, color: "var(--vf-text-primary)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
