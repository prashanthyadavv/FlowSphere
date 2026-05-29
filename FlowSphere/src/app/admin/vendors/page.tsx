"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VENDORS as MOCK_VENDORS } from "@/lib/mockData";
import { useDemoStore } from "@/lib/store/demoStore";
import { useDataStore, Vendor } from "@/lib/store/dataStore";

type VendorStatus = "open" | "closed" | "busy";
const TYPE_COLORS: Record<string, string> = { food: "#F59E0B", beverage: "#00D4FF", merchandise: "#8B5CF6" };

const BLANK: Omit<Vendor, "id" | "items" | "revenue" | "rating"> = { name: "", type: "food", zone: "", gate: "", status: "closed", currentOrders: 0 };

export default function VendorsPage() {
  const { isDemoMode } = useDemoStore();
  const { vendors: storedVendors, addVendor, updateVendor, deleteVendor } = useDataStore();
  const vendors = isDemoMode ? [...MOCK_VENDORS, ...storedVendors] : storedVendors;

  const [modal, setModal] = useState<{ mode: "create" | "edit"; data: Partial<Vendor> } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "food" | "beverage" | "merchandise">("all");
  const [saved, setSaved] = useState(false);

  const filtered = vendors.filter(v => {
    const ms = !search || v.name.toLowerCase().includes(search.toLowerCase());
    const mt = typeFilter === "all" || v.type === typeFilter;
    return ms && mt;
  });

  const saveVendor = () => {
    if (!modal?.data) return;
    if (modal.mode === "create") {
      const newV: Vendor = { ...modal.data as any, id: `V${Date.now().toString().slice(-4)}`, rating: 0, revenue: 0 };
      addVendor(newV);
    } else {
      updateVendor(modal.data.id!, modal.data);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setModal(null); }, 800);
  };

  const confirmDelete = () => {
    if (deleteId) deleteVendor(deleteId);
    setDeleteId(null);
  };

  const totalRev = vendors.reduce((s, v) => s + v.revenue, 0);

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🍽️ Vendor Management</h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>{vendors.length} vendors · Total revenue: ₹{(totalRev / 1000).toFixed(1)}k</p>
        </div>
        <button onClick={() => setModal({ mode: "create", data: { ...BLANK } })}
          style={{ padding: "11px 22px", background: "var(--vf-grad-purple)", color: "white", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer" }}>
          + Add Vendor
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Food Stalls", value: vendors.filter(v => v.type === "food").length, color: "#F59E0B", icon: "🍔" },
          { label: "Beverage Stalls", value: vendors.filter(v => v.type === "beverage").length, color: "#00D4FF", icon: "🥤" },
          { label: "Merchandise", value: vendors.filter(v => v.type === "merchandise").length, color: "#8B5CF6", icon: "👕" },
        ].map(s => (
          <div key={s.label} className="glass" style={{ padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--vf-text-muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search vendors..."
          style={{ flex: 1, minWidth: 200, padding: "10px 14px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 10, color: "var(--vf-text-primary)", fontSize: 14, outline: "none" }} />
        {(["all", "food", "beverage", "merchandise"] as const).map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            style={{ padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
              background: typeFilter === t ? "rgba(139,92,246,0.15)" : "var(--vf-bg-glass)",
              color: typeFilter === t ? "#8B5CF6" : "var(--vf-text-secondary)",
              borderColor: typeFilter === t ? "rgba(139,92,246,0.4)" : "var(--vf-border)" }}>
            {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="glass" style={{ overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr><th>Vendor</th><th>Category</th><th>Location</th><th>Items</th><th>Revenue</th><th>Status</th><th style={{ textAlign: "right" }}>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <motion.tr key={v.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td>
                  <div style={{ fontWeight: 700, color: "var(--vf-text-primary)", fontSize: 14 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: "var(--vf-text-muted)" }}>⭐ {v.rating} avg rating</div>
                </td>
                <td><span style={{ background: `${TYPE_COLORS[v.type]}15`, color: TYPE_COLORS[v.type], padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>{v.type}</span></td>
                <td style={{ fontSize: 13 }}>{v.zone}<br /><span style={{ fontSize: 11, color: "var(--vf-text-muted)" }}>{v.gate}</span></td>
                <td style={{ fontSize: 13, fontWeight: 600 }}>{v.items?.length || 0} items</td>
                <td style={{ fontSize: 14, fontWeight: 700, color: "var(--vf-cyan)" }}>₹{v.revenue.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${v.status === "open" ? "status-live" : v.status === "busy" ? "status-warning" : "status-danger"}`} style={{ fontSize: 10 }}>
                    {v.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button onClick={() => setModal({ mode: "edit", data: { ...v } })}
                      style={{ padding: "6px 10px", background: "rgba(0,212,255,0.1)", color: "var(--vf-cyan)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>✏️ Edit</button>
                    <button onClick={() => setDeleteId(v.id)}
                      style={{ padding: "6px 10px", background: "rgba(244,63,94,0.1)", color: "#F43F5E", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>🗑️ Delete</button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => !saved && setModal(null)}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} onClick={e => e.stopPropagation()} className="glass" style={{ width: "100%", maxWidth: 480, padding: 32, maxHeight: "85vh", overflowY: "auto" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginBottom: 24 }}>{modal.mode === "create" ? "➕ Add Vendor" : "✏️ Edit Vendor"}</h2>
              {saved ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}><div style={{ fontSize: 48, marginBottom: 12 }}>✅</div><div style={{ fontWeight: 700, color: "#10B981" }}>Saved!</div></div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Vendor Name", key: "name", type: "text", placeholder: "e.g. Spice Bowl" },
                    { label: "Zone", key: "zone", type: "text", placeholder: "e.g. North Concourse" },
                    { label: "Gate / Location", key: "gate", type: "text", placeholder: "e.g. Gate A" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--vf-text-secondary)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</label>
                      <input type="text" value={(modal.data as any)[f.key] ?? ""} onChange={e => setModal(p => p ? { ...p, data: { ...p.data, [f.key]: e.target.value } } : p)} placeholder={f.placeholder}
                        style={{ width: "100%", padding: "10px 12px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 9, color: "var(--vf-text-primary)", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  {[
                    { label: "Category", key: "type", options: ["food", "beverage", "merchandise"] },
                    { label: "Status", key: "status", options: ["open", "closed", "busy"] },
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
                    <button onClick={saveVendor} style={{ flex: 1, padding: "13px", background: "var(--vf-grad-purple)", color: "white", fontWeight: 700, borderRadius: 10, border: "none", cursor: "pointer" }}>{modal.mode === "create" ? "Add Vendor" : "Save"}</button>
                    <button onClick={() => setModal(null)} style={{ flex: 1, padding: "13px", background: "var(--vf-bg-glass)", color: "var(--vf-text-secondary)", fontWeight: 700, borderRadius: 10, border: "1px solid var(--vf-border)", cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()} className="glass" style={{ padding: 32, textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Delete Vendor?</h2>
            <p style={{ color: "var(--vf-text-secondary)", fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "10px", background: "var(--vf-bg-secondary)", borderRadius: 10, color: "var(--vf-text-primary)", fontWeight: 600, border: "1px solid var(--vf-border)", cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: "10px", background: "#F43F5E", borderRadius: 10, color: "white", fontWeight: 700, border: "none", cursor: "pointer" }}>Delete</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
