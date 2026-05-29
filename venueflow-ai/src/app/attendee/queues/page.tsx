"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUEUES, formatWait } from "@/lib/mockData";
import type { QueueItem } from "@/lib/mockData";
import Link from "next/link";
import { useDemoStore } from "@/lib/store/demoStore";
import { useDataStore } from "@/lib/store/dataStore";

export default function QueuesPage() {
  const { isDemoMode } = useDemoStore();
  const { vendors } = useDataStore();

  const getInitialQueues = () => {
    if (isDemoMode) return QUEUES;
    return vendors.map(v => ({
      id: v.id, vendorName: v.name, vendorType: v.type as any, zone: v.zone || "Venue", status: v.status as any, estimatedWait: 0, currentQueue: 0, capacity: 50, avgServiceTime: 60, queueTrend: "stable" as any, position: { x: 0, y: 0 }
    }));
  };

  const [queues, setQueues] = useState<QueueItem[]>(getInitialQueues());
  const [issuedTokens, setIssuedTokens] = useState<Record<string, string>>({});
  const [tokenModal, setTokenModal] = useState<QueueItem | null>(null);
  const [filter, setFilter] = useState<"all" | "food" | "beverage" | "restroom">("all");
  const [sortBy, setSortBy] = useState<"wait" | "name" | "zone">("wait");

  useEffect(() => {
    setQueues(getInitialQueues());
  }, [isDemoMode, vendors]);

  useEffect(() => {
    if (!isDemoMode) return;
    const interval = setInterval(() => {
      setQueues(prev => prev.map(q => ({
        ...q,
        currentQueue: Math.max(0, q.currentQueue + Math.round((Math.random() - 0.42) * 3)),
        estimatedWait: Math.max(1, Math.round(q.currentQueue * (q.avgServiceTime / 60))),
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  const issueToken = (q: QueueItem) => {
    const token = `T-${q.zone.slice(0, 1)}${Math.floor(Math.random() * 90 + 10)}`;
    setIssuedTokens(prev => ({ ...prev, [q.id]: token }));
    setTokenModal(q);
  };

  let filtered = filter === "all" ? queues : queues.filter(q => q.vendorType === filter);
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "wait") return a.estimatedWait - b.estimatedWait;
    if (sortBy === "name") return a.vendorName.localeCompare(b.vendorName);
    return a.zone.localeCompare(b.zone);
  });

  const getWaitColor = (min: number) => min > 30 ? "#F43F5E" : min > 15 ? "#F59E0B" : "#10B981";

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>⏱️ Queue Tracker</h1>
        <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>
          Live queue depths · AI predicted wait times · Virtual token system ·
          <Link href="/attendee/food" style={{ color: "var(--vf-cyan)", textDecoration: "none", marginLeft: 6 }}>Order food instead →</Link>
        </p>
      </div>

      {isDemoMode && (
        <div className="glass" style={{ padding: "14px 20px", marginBottom: 20, borderLeft: "3px solid var(--vf-cyan)", background: "rgba(0,212,255,0.05)", display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div>
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--vf-cyan)" }}>AI Insight: </span>
            <span style={{ fontSize: 13, color: "var(--vf-text-secondary)" }}>
              Half-time in ~8 minutes. Queues will spike 3× in the next 15 minutes. <strong style={{ color: "var(--vf-text-primary)" }}>Pre-order from the Food menu now</strong> to skip it entirely.
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "food", "beverage", "restroom"].map(f => (
            <button key={f} onClick={() => setFilter(f as any)}
              style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
                background: filter === f ? "rgba(0,212,255,0.12)" : "var(--vf-bg-glass)",
                color: filter === f ? "var(--vf-cyan)" : "var(--vf-text-secondary)",
                borderColor: filter === f ? "rgba(0,212,255,0.4)" : "var(--vf-border)" }}>
              {f === "all" ? "All" : f === "food" ? "🍔" : f === "beverage" ? "🥤" : "🚻"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 12, color: "var(--vf-text-muted)" }}>Sort:</span>
          {["wait", "name", "zone"].map(s => (
            <button key={s} onClick={() => setSortBy(s as any)}
              style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
                background: sortBy === s ? "rgba(139,92,246,0.15)" : "transparent",
                color: sortBy === s ? "#8B5CF6" : "var(--vf-text-muted)",
                borderColor: sortBy === s ? "rgba(139,92,246,0.4)" : "var(--vf-border)" }}>
              {s === "wait" ? "⏱ Wait" : s === "name" ? "A-Z" : "Zone"}
            </button>
          ))}
        </div>
      </div>

      {queues.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Shortest Wait", value: isDemoMode ? formatWait(Math.min(...queues.filter(q => q.vendorType !== "restroom").map(q => q.estimatedWait))) : "0 mins", color: "#10B981", icon: "✅" },
            { label: "Average Wait", value: isDemoMode ? formatWait(Math.round(queues.filter(q => q.vendorType !== "restroom").reduce((s, q) => s + q.estimatedWait, 0) / (queues.filter(q => q.vendorType !== "restroom").length || 1))) : "0 mins", color: "#F59E0B", icon: "⏱️" },
            { label: "Longest Wait", value: isDemoMode ? formatWait(Math.max(...queues.filter(q => q.vendorType !== "restroom").map(q => q.estimatedWait))) : "0 mins", color: "#F43F5E", icon: "⚠️" },
          ].map(s => (
            <div key={s.label} className="glass" style={{ padding: "16px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {filtered.length > 0 ? filtered.map(q => {
          const pct = Math.min(100, Math.round((q.currentQueue / q.capacity) * 100));
          const token = issuedTokens[q.id];
          return (
            <motion.div key={q.id} layout className="glass card-hover" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>{q.vendorName}</div>
                  <div style={{ fontSize: 12, color: "var(--vf-text-muted)", marginTop: 2 }}>📍 {q.zone}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, color: getWaitColor(q.estimatedWait) }}>
                    {formatWait(q.estimatedWait)}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--vf-text-muted)" }}>est. wait</div>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
                  <span style={{ color: "var(--vf-text-muted)" }}>{q.currentQueue} people ahead</span>
                  <span style={{ fontWeight: 700, color: "var(--vf-text-secondary)" }}>{pct}% full</span>
                </div>
                <div className="progress-bar-track" style={{ height: 7 }}>
                  <div className="queue-fill" style={{ width: `${pct}%`, height: "100%", background: getWaitColor(q.estimatedWait) }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {q.vendorType !== "restroom" && (
                  <button onClick={() => issueToken(q)} disabled={!!token}
                    style={{ flex: 1, padding: "9px 14px", background: token ? "rgba(16,185,129,0.1)" : "rgba(0,212,255,0.1)", color: token ? "#10B981" : "var(--vf-cyan)", border: `1px solid ${token ? "rgba(16,185,129,0.3)" : "rgba(0,212,255,0.3)"}`, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: token ? "default" : "pointer" }}>
                    {token ? `🎫 Token: ${token}` : "🎫 Get Token"}
                  </button>
                )}
                <span className={`status-badge ${q.status === "busy" ? "status-warning" : q.status === "closed" ? "status-danger" : "status-live"}`} style={{ whiteSpace: "nowrap" }}>
                  <span className={`pulse-dot pulse-dot-${q.status === "busy" ? "amber" : q.status === "closed" ? "red" : "green"}`} />
                  {q.status.toUpperCase()}
                </span>
              </div>
            </motion.div>
          );
        }) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "40px 0", gridColumn: "1 / -1" }}>No vendors or queues available.</div>}
      </div>

      {/* Token modal */}
      <AnimatePresence>
        {tokenModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setTokenModal(null)}>
            <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="glass" style={{ padding: 36, maxWidth: 360, width: "90%", textAlign: "center", border: "2px solid var(--vf-cyan)" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎫</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Virtual Token Issued!</h3>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 52, fontWeight: 900, color: "var(--vf-cyan)", marginBottom: 8 }}>
                {issuedTokens[tokenModal.id]}
              </div>
              <div style={{ color: "var(--vf-text-secondary)", fontSize: 14, marginBottom: 8 }}>{tokenModal.vendorName}</div>
              <div style={{ color: "var(--vf-text-muted)", fontSize: 13, marginBottom: 20 }}>
                Estimated wait: <strong style={{ color: "var(--vf-text-primary)" }}>{formatWait(tokenModal.estimatedWait)}</strong>
                <br />You'll be notified when your turn is near.
              </div>
              <button onClick={() => setTokenModal(null)}
                style={{ width: "100%", padding: "12px", background: "var(--vf-grad-cyan)", color: "#050A14", fontWeight: 700, borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14 }}>
                Explore the Venue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
