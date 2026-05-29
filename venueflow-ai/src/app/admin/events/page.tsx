"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "@/lib/store/demoStore";
import { useDataStore, EventItem } from "@/lib/store/dataStore";

type EventStatus = "upcoming" | "live" | "completed" | "cancelled";

const MOCK_EVENTS: EventItem[] = [
  { id: "E001", name: "Mumbai Indians vs Delhi Capitals", venue: "National Stadium, Mumbai", sport: "Cricket", date: "2026-05-26", time: "18:00", capacity: 60000, ticketsSold: 52847, status: "live", teams: "Mumbai Indians · Delhi Capitals" },
  { id: "E002", name: "Football Premier League — Semifinal", venue: "Wankhede Arena", sport: "Football", date: "2026-05-30", time: "19:30", capacity: 40000, ticketsSold: 38200, status: "upcoming", teams: "City FC · United FC" },
  { id: "E003", name: "Formula 1 Night Race", venue: "Marina Circuit", sport: "F1", date: "2026-06-05", time: "20:00", capacity: 100000, ticketsSold: 97300, status: "upcoming", teams: "Full Grid — 20 drivers" },
  { id: "E004", name: "Pro Kabaddi League Final", venue: "Indoor Stadium, Delhi", sport: "Kabaddi", date: "2026-05-20", time: "17:00", capacity: 15000, ticketsSold: 15000, status: "completed", teams: "Panthers · Bulls" },
  { id: "E005", name: "IPL Playoff — Eliminator", venue: "Eden Gardens, Kolkata", sport: "Cricket", date: "2026-06-01", time: "19:30", capacity: 66000, ticketsSold: 61400, status: "upcoming", teams: "RCB · KKR" },
];

const SPORTS = ["Cricket", "Football", "Basketball", "F1", "Kabaddi", "Hockey", "Tennis", "Other"];
const VENUES_LIST = ["National Stadium, Mumbai", "Wankhede Arena", "Eden Gardens, Kolkata", "Marina Circuit", "Indoor Stadium, Delhi"];
const STATUS_CFG: Record<EventStatus, { color: string; label: string }> = {
  live: { color: "#10B981", label: "🟢 Live" },
  upcoming: { color: "#3B7FFF", label: "🔵 Upcoming" },
  completed: { color: "#4A5578", label: "⚫ Completed" },
  cancelled: { color: "#F43F5E", label: "🔴 Cancelled" },
};

const BLANK: Omit<EventItem, "id"> = { name: "", venue: VENUES_LIST[0], sport: SPORTS[0], date: "", time: "", capacity: 60000, ticketsSold: 0, status: "upcoming", teams: "" };

export default function EventsCRUD() {
  const { isDemoMode } = useDemoStore();
  const { events: storedEvents, addEvent, updateEvent, deleteEvent } = useDataStore();
  const events = isDemoMode ? [...MOCK_EVENTS, ...storedEvents] : storedEvents;

  const [modal, setModal] = useState<{ mode: "create" | "edit"; data: Partial<EventItem> } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");
  const [saved, setSaved] = useState(false);

  const filtered = events.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.sport.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => setModal({ mode: "create", data: { ...BLANK } });
  const openEdit = (e: EventItem) => setModal({ mode: "edit", data: { ...e } });

  const saveEvent = () => {
    if (!modal?.data) return;
    if (modal.mode === "create") {
      const newEvent: EventItem = { ...modal.data as Omit<EventItem, "id">, id: `E${Date.now().toString().slice(-4)}` } as EventItem;
      addEvent(newEvent);
    } else {
      updateEvent(modal.data.id!, modal.data);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setModal(null); }, 800);
  };

  const confirmDelete = () => {
    if (deleteId) deleteEvent(deleteId);
    setDeleteId(null);
  };

  const updateField = (key: keyof typeof BLANK, val: string | number) => {
    setModal(prev => prev ? { ...prev, data: { ...prev.data, [key]: val } } : prev);
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>📅 Events Management</h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>{events.length} total events · {events.filter(e => e.status === "live").length} live now</p>
        </div>
        <button onClick={openCreate}
          style={{ padding: "11px 22px", background: "var(--vf-grad-purple)", color: "white", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          + Create Event
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search events..."
          style={{ flex: 1, minWidth: 200, padding: "10px 14px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 10, color: "var(--vf-text-primary)", fontSize: 14, outline: "none" }} />
        {(["all", "live", "upcoming", "completed", "cancelled"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{ padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
              background: statusFilter === s ? "rgba(139,92,246,0.15)" : "var(--vf-bg-glass)",
              color: statusFilter === s ? "#8B5CF6" : "var(--vf-text-secondary)",
              borderColor: statusFilter === s ? "rgba(139,92,246,0.4)" : "var(--vf-border)" }}>
            {s === "all" ? "All" : STATUS_CFG[s as EventStatus]?.label || s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass" style={{ overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Event</th><th>Sport</th><th>Date & Time</th><th>Venue</th>
              <th>Tickets</th><th>Status</th><th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const pct = Math.round((e.ticketsSold / e.capacity) * 100);
              return (
                <motion.tr key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--vf-text-primary)", fontSize: 14 }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{e.id}</div>
                  </td>
                  <td><span style={{ background: "rgba(139,92,246,0.1)", color: "#8B5CF6", padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>{e.sport}</span></td>
                  <td>
                    <div style={{ fontSize: 13 }}>{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div style={{ fontSize: 11, color: "var(--vf-text-muted)" }}>{e.time}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{e.venue}</td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{e.ticketsSold.toLocaleString()} / {e.capacity.toLocaleString()}</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                      <div className="progress-bar-track" style={{ height: 4, width: 80 }}>
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct > 90 ? "#F43F5E" : pct > 70 ? "#F59E0B" : "#10B981" }} />
                      </div>
                      <span style={{ fontSize: 10, color: "var(--vf-text-muted)" }}>{pct}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: STATUS_CFG[e.status as EventStatus]?.color || "#FFF", fontSize: 12, fontWeight: 700 }}>
                      {STATUS_CFG[e.status as EventStatus]?.label || e.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button onClick={() => openEdit(e)}
                        style={{ padding: "6px 12px", background: "rgba(0,212,255,0.1)", color: "var(--vf-cyan)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => setDeleteId(e.id)}
                        style={{ padding: "6px 12px", background: "rgba(244,63,94,0.1)", color: "#F43F5E", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--vf-text-muted)", fontSize: 14 }}>No events found.</div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => !saved && setModal(null)}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
              onClick={e => e.stopPropagation()}
              className="glass" style={{ width: "100%", maxWidth: 560, padding: 32, maxHeight: "90vh", overflowY: "auto" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginBottom: 24 }}>
                {modal.mode === "create" ? "➕ Create Event" : "✏️ Edit Event"}
              </h2>

              {saved ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <div style={{ fontWeight: 700, color: "#10B981" }}>Saved successfully!</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "Event Name", key: "name", type: "text", placeholder: "e.g. Mumbai vs Delhi" },
                    { label: "Teams / Participants", key: "teams", type: "text", placeholder: "e.g. Team A · Team B" },
                    { label: "Date", key: "date", type: "date" },
                    { label: "Time", key: "time", type: "time" },
                    { label: "Capacity", key: "capacity", type: "number" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--vf-text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</label>
                      <input type={f.type} value={(modal.data as any)[f.key]} onChange={e => updateField(f.key as any, f.type === "number" ? Number(e.target.value) : e.target.value)} placeholder={(f as any).placeholder}
                        style={{ width: "100%", padding: "10px 12px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 9, color: "var(--vf-text-primary)", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  {[
                    { label: "Sport", key: "sport", options: SPORTS },
                    { label: "Venue", key: "venue", options: VENUES_LIST },
                    { label: "Status", key: "status", options: ["upcoming", "live", "completed", "cancelled"] },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--vf-text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</label>
                      <select value={(modal.data as any)[f.key]} onChange={e => updateField(f.key as any, e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 9, color: "var(--vf-text-primary)", fontSize: 14, outline: "none" }}>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button onClick={saveEvent}
                      style={{ flex: 1, padding: "13px", background: "var(--vf-grad-purple)", color: "white", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer" }}>
                      {modal.mode === "create" ? "Create Event" : "Save Changes"}
                    </button>
                    <button onClick={() => setModal(null)}
                      style={{ flex: 1, padding: "13px", background: "var(--vf-bg-glass)", color: "var(--vf-text-secondary)", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "1px solid var(--vf-border)", cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass" style={{ padding: 32, maxWidth: 380, width: "90%", textAlign: "center", border: "2px solid rgba(244,63,94,0.4)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Delete Event?</h3>
              <p style={{ color: "var(--vf-text-secondary)", fontSize: 14, marginBottom: 24 }}>
                <strong>{events.find(e => e.id === deleteId)?.name}</strong><br />This action cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={confirmDelete}
                  style={{ flex: 1, padding: "12px", background: "var(--vf-grad-danger)", color: "white", fontWeight: 700, borderRadius: 10, border: "none", cursor: "pointer" }}>
                  Yes, Delete
                </button>
                <button onClick={() => setDeleteId(null)}
                  style={{ flex: 1, padding: "12px", background: "var(--vf-bg-glass)", color: "var(--vf-text-secondary)", fontWeight: 700, borderRadius: 10, border: "1px solid var(--vf-border)", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
