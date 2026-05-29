"use client";
import { NOTIFICATIONS, timeAgo } from "@/lib/mockData";
import { useState } from "react";
import { motion } from "framer-motion";

const typeConfig = {
  warning: { icon: "⚠️", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  success: { icon: "✅", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  promo: { icon: "⭐", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  info: { icon: "ℹ️", color: "#00D4FF", bg: "rgba(0,212,255,0.08)" },
  danger: { icon: "🚨", color: "#F43F5E", bg: "rgba(244,63,94,0.1)" },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🔔 Notifications</h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>{notifs.filter(n => !n.read).length} unread alerts</p>
        </div>
        <button onClick={markAll} style={{ padding: "8px 16px", background: "var(--vf-bg-glass)", color: "var(--vf-text-secondary)", border: "1px solid var(--vf-border)", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          Mark all read
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifs.map(n => {
          const cfg = typeConfig[n.type];
          return (
            <motion.div key={n.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="glass card-hover" style={{ padding: "16px 20px", borderLeft: `3px solid ${cfg.color}`, background: n.read ? undefined : cfg.bg, cursor: "pointer" }}
              onClick={() => markRead(n.id)}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{cfg.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: n.read ? "var(--vf-text-secondary)" : "var(--vf-text-primary)" }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: "var(--vf-text-muted)", whiteSpace: "nowrap" }}>{timeAgo(n.timestamp)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--vf-text-secondary)", lineHeight: 1.5 }}>{n.message}</div>
                  {n.actionLabel && (
                    <span style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 700, color: cfg.color }}>
                      {n.actionLabel} →
                    </span>
                  )}
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0, marginTop: 4 }} />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
