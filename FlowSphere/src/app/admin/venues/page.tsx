"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "@/lib/store/demoStore";
import { useDataStore, VenueZone } from "@/lib/store/dataStore";

type ZoneType = "stand" | "concourse" | "restroom" | "gate" | "parking" | "vip";
type ZoneStatus = "operational" | "maintenance" | "closed";

const MOCK_ZONES: VenueZone[] = [
  { id: "Z001", name: "North Stand", type: "stand", capacity: 15000, level: "Ground + Upper", gate: "Gate A", status: "operational", features: "Prime view, Cover" },
  { id: "Z002", name: "South Stand", type: "stand", capacity: 12000, level: "Ground + Upper", gate: "Gate C", status: "operational", features: "Scoreboard view" },
  { id: "Z003", name: "East Stand", type: "stand", capacity: 18000, level: "Ground + Upper + Premium", gate: "Gate B", status: "operational", features: "Executive boxes, Pitch-side" },
  { id: "Z004", name: "West Stand", type: "stand", capacity: 14000, level: "Ground + Upper", gate: "Gate D", status: "operational", features: "Family zone, Accessibility" },
  { id: "Z005", name: "North Concourse", type: "concourse", capacity: 5000, level: "Ground", gate: "Gate A", status: "operational", features: "Food court, ATM" },
  { id: "Z006", name: "VIP Lounge A", type: "vip", capacity: 500, level: "Upper Tier", gate: "VIP Entrance", status: "operational", features: "Waiter service, Premium catering" },
  { id: "Z008", name: "Zone Beta Parking", type: "parking", capacity: 1200, level: "Surface", gate: "East Gate", status: "operational", features: "EV charging, CCTV" },
];

const TYPE_CFG: Record<ZoneType, { icon: string; color: string }> = {
  stand: { icon: "🏟️", color: "#3B7FFF" },
  concourse: { icon: "🛤️", color: "#00D4FF" },
  restroom: { icon: "🚻", color: "#8B5CF6" },
  gate: { icon: "🚪", color: "#F59E0B" },
  parking: { icon: "🅿️", color: "#10B981" },
  vip: { icon: "⭐", color: "#F59E0B" },
};
const STATUS_CFG: Record<ZoneStatus, { color: string; badge: string }> = {
  operational: { color: "#10B981", badge: "status-live" },
  maintenance: { color: "#F59E0B", badge: "status-warning" },
  closed: { color: "#F43F5E", badge: "status-danger" },
};

const BLANK: Omit<VenueZone, "id"> = { name: "", type: "stand", capacity: 1000, level: "", gate: "", status: "operational", features: "" };

export default function VenuesPage() {
  const { isDemoMode } = useDemoStore();
  const { zones: storedZones, addZone, updateZone, deleteZone } = useDataStore();
  const zones = isDemoMode ? [...MOCK_ZONES, ...storedZones] : storedZones;

  const [modal, setModal] = useState<{ mode: "create" | "edit"; data: Partial<VenueZone> } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ZoneType | "all">("all");
  const [saved, setSaved] = useState(false);

  const filtered = zones.filter(z => {
    const ms = !search || z.name.toLowerCase().includes(search.toLowerCase());
    const mt = typeFilter === "all" || z.type === typeFilter;
    return ms && mt;
  });

  const saveZone = () => {
    if (!modal?.data) return;
    if (modal.mode === "create") {
      addZone({ ...modal.data, id: `Z${Date.now().toString().slice(-4)}` } as VenueZone);
    } else {
      updateZone(modal.data.id!, modal.data);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setModal(null); }, 800);
  };

  const confirmDelete = () => {
    if (deleteId) deleteZone(deleteId);
    setDeleteId(null);
  };

  const totalCapacity = zones.reduce((s, z) => s + z.capacity, 0);

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🏟️ Venues & Zones</h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>{zones.length} zones · Total capacity: {totalCapacity.toLocaleString()}</p>
        </div>
        <button onClick={() => setModal({ mode: "create", data: { ...BLANK } })}
          style={{ padding: "11px 22px", background: "var(--vf-grad-purple)", color: "white", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer" }}>
          + Add Zone
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Operational", value: zones.filter(z => z.status === "operational").length, color: "#10B981", icon: "✅" },
          { label: "Maintenance", value: zones.filter(z => z.status === "maintenance").length, color: "#F59E0B", icon: "🔧" },
          { label: "Closed", value: zones.filter(z => z.status === "closed").length, color: "#F43F5E", icon: "🚫" },
        ].map(s => (
          <div key={s.label} className="glass" style={{ padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--vf-text-muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search zones..."
          style={{ flex: 1, minWidth: 200, padding: "10px 14px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 10, color: "var(--vf-text-primary)", fontSize: 14, outline: "none" }} />
        {(["all", "stand", "concourse", "vip", "parking"] as const).map(t => (
          <button key={t} onClick={() => setTypeFilter(t as any)}
            style={{ padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
              background: typeFilter === t ? "rgba(0,212,255,0.12)" : "var(--vf-bg-glass)",
              color: typeFilter === t ? "var(--vf-cyan)" : "var(--vf-text-secondary)",
              borderColor: typeFilter === t ? "rgba(0,212,255,0.4)" : "var(--vf-border)" }}>
            {t === "all" ? "All" : `${TYPE_CFG[t as ZoneType]?.icon ?? ""} ${t.charAt(0).toUpperCase() + t.slice(1)}`}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {filtered.map(z => {
          const cfg = TYPE_CFG[z.type as ZoneType] || { icon: "📍", color: "#666" };
          return (
            <motion.div key={z.id} layout className="glass card-hover" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cfg.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{cfg.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{z.name}</div>
                    <div style={{ fontSize: 11, color: "var(--vf-text-muted)", textTransform: "capitalize" }}>{z.type} · {z.gate}</div>
                  </div>
                </div>
                <span className={`status-badge ${STATUS_CFG[z.status as ZoneStatus]?.badge || "status-live"}`} style={{ fontSize: 10 }}>
                  {z.status.toUpperCase()}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Capacity", val: z.capacity.toLocaleString() },
                  { label: "Level", val: z.level },
                  { label: "Features", val: z.features },
                ].map(i => (
                  <div key={i.label} style={{ background: "var(--vf-bg-secondary)", padding: "8px 10px", borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: "var(--vf-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{i.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{i.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setModal({ mode: "edit", data: { ...z } })}
                  style={{ flex: 1, padding: "9px", background: "rgba(0,212,255,0.1)", color: "var(--vf-cyan)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>✏️ Edit</button>
                <button onClick={() => setDeleteId(z.id)}
                  style={{ padding: "9px 14px", background: "rgba(244,63,94,0.1)", color: "#F43F5E", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🗑️</button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => !saved && setModal(null)}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
              onClick={e => e.stopPropagation()} className="glass" style={{ width: "100%", maxWidth: 520, padding: 32, maxHeight: "85vh", overflowY: "auto" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginBottom: 24 }}>
                {modal.mode === "create" ? "➕ Add Zone" : "✏️ Edit Zone"}
              </h2>
              {saved ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <div style={{ fontWeight: 700, color: "#10B981" }}>Saved!</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Zone Name", key: "name", type: "text", placeholder: "e.g. North Stand" },
                    { label: "Gate", key: "gate", type: "text", placeholder: "e.g. Gate A" },
                    { label: "Level", key: "level", type: "text", placeholder: "e.g. Ground + Upper" },
                    { label: "Capacity", key: "capacity", type: "number" },
                    { label: "Features", key: "features", type: "text", placeholder: "e.g. CCTV, Accessibility" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--vf-text-secondary)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</label>
                      <input type={f.type} value={(modal.data as any)[f.key] ?? ""} onChange={e => setModal(p => p ? { ...p, data: { ...p.data, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value } } : p)} placeholder={(f as any).placeholder}
                        style={{ width: "100%", padding: "10px 12px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 9, color: "var(--vf-text-primary)", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  {[
                    { label: "Zone Type", key: "type", options: ["stand","concourse","restroom","gate","parking","vip"] },
                    { label: "Status", key: "status", options: ["operational","maintenance","closed"] },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--vf-text-secondary)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</label>
                      <select value={(modal.data as any)[f.key] ?? ""} onChange={e => setModal(p => p ? { ...p, data: { ...p.data, [f.key]: e.target.value } } : p)}
                        style={{ width: "100%", padding: "10px 12px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 9, color: "var(--vf-text-primary)", fontSize: 14, outline: "none" }}>
                        {f.options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                      </select>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button onClick={saveZone} style={{ flex: 1, padding: "13px", background: "var(--vf-grad-purple)", color: "white", fontWeight: 700, borderRadius: 10, border: "none", cursor: "pointer" }}>
                      {modal.mode === "create" ? "Create Zone" : "Save Changes"}
                    </button>
                    <button onClick={() => setModal(null)} style={{ flex: 1, padding: "13px", background: "var(--vf-bg-glass)", color: "var(--vf-text-secondary)", fontWeight: 700, borderRadius: 10, border: "1px solid var(--vf-border)", cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()} className="glass" style={{ padding: 32, textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Delete Zone?</h2>
            <p style={{ color: "var(--vf-text-secondary)", fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "10px", background: "var(--vf-bg-secondary)", borderRadius: 10, color: "var(--vf-text-primary)", fontWeight: 600, border: "1px solid var(--vf-border)", cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: "10px", background: "#F43F5E", borderRadius: 10, color: "white", fontWeight: 700, border: "none", cursor: "pointer" }}>Delete</button>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
