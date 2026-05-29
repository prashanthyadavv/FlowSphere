"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "@/lib/store/demoStore";
import { useDataStore, AdminUser } from "@/lib/store/dataStore";

type UserRole = "attendee" | "admin" | "security" | "staff";
type UserStatus = "active" | "suspended" | "pending";

const MOCK_USERS: AdminUser[] = [
  { id: "U001", name: "Raj Kumar", email: "attendee@flowsphere.io", role: "attendee", status: "active", joined: "2026-01-15", lastLogin: "2026-05-26", },
  { id: "U002", name: "Priya Sharma", email: "admin@flowsphere.io", role: "admin", status: "active", joined: "2025-08-01", lastLogin: "2026-05-26", },
  { id: "U003", name: "Arjun Singh", email: "security@flowsphere.io", role: "security", status: "active", joined: "2025-10-10", lastLogin: "2026-05-26", gate: "Gate A" },
  { id: "U004", name: "Divya Nair", email: "divya@flowsphere.io", role: "staff", status: "active", joined: "2026-02-20", lastLogin: "2026-05-25", gate: "Gate B" },
  { id: "U006", name: "Aisha Khan", email: "aisha@flowsphere.io", role: "attendee", status: "suspended", joined: "2026-04-05", lastLogin: "2026-05-10", },
  { id: "U007", name: "Vikram Pillai", email: "vikram@flowsphere.io", role: "staff", status: "pending", joined: "2026-05-24", lastLogin: "Never", gate: "Gate D" },
];

const ROLE_COLORS: Record<UserRole, string> = { attendee: "#3B7FFF", admin: "#8B5CF6", security: "#F43F5E", staff: "#F59E0B" };
const STATUS_COLORS: Record<UserStatus, string> = { active: "#10B981", suspended: "#F43F5E", pending: "#F59E0B" };
const BLANK_USER: Omit<AdminUser, "id"> = { name: "", email: "", role: "attendee", status: "active", joined: new Date().toISOString().split("T")[0], lastLogin: "Never" };

export default function UsersPage() {
  const { isDemoMode } = useDemoStore();
  const { users: storedUsers, addUser, updateUser, deleteUser } = useDataStore();
  const users = isDemoMode ? [...MOCK_USERS, ...storedUsers] : storedUsers;

  const [modal, setModal] = useState<{ mode: "create" | "edit"; data: Partial<AdminUser> } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [saved, setSaved] = useState(false);

  const filtered = users.filter(u => {
    const ms = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const mr = roleFilter === "all" || u.role === roleFilter;
    return ms && mr;
  });

  const saveUser = () => {
    if (!modal?.data) return;
    if (modal.mode === "create") {
      addUser({ ...modal.data, id: `U${Date.now().toString().slice(-4)}` } as AdminUser);
    } else {
      updateUser(modal.data.id!, modal.data);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setModal(null); }, 800);
  };

  const toggleStatus = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) updateUser(id, { status: user.status === "active" ? "suspended" : "active" });
  };

  const updateField = (key: keyof AdminUser, val: string) => {
    setModal(prev => prev ? { ...prev, data: { ...prev.data, [key]: val } } : prev);
  };

  const confirmDelete = () => {
    if (deleteId) deleteUser(deleteId);
    setDeleteId(null);
  };

  const roleCounts = Object.fromEntries((["attendee","admin","security","staff"] as UserRole[]).map(r => [r, users.filter(u => u.role === r).length]));

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>👤 User Management</h1>
          <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>{users.length} total users · {users.filter(u => u.status === "active").length} active</p>
        </div>
        <button onClick={() => setModal({ mode: "create", data: { ...BLANK_USER } })}
          style={{ padding: "11px 22px", background: "var(--vf-grad-purple)", color: "white", fontWeight: 700, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer" }}>
          + Add User
        </button>
      </div>

      {/* Role stat pills */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {(Object.entries(roleCounts) as [UserRole, number][]).map(([role, count]) => (
          <div key={role} style={{ padding: "8px 14px", background: `${ROLE_COLORS[role]}15`, border: `1px solid ${ROLE_COLORS[role]}30`, borderRadius: 100, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: ROLE_COLORS[role], textTransform: "capitalize" }}>{role}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: ROLE_COLORS[role] }}>{count}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search name or email..."
          style={{ flex: 1, minWidth: 200, padding: "10px 14px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 10, color: "var(--vf-text-primary)", fontSize: 14, outline: "none" }} />
        {(["all", "attendee", "admin", "security", "staff"] as const).map(r => (
          <button key={r} onClick={() => setRoleFilter(r as any)}
            style={{ padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
              background: roleFilter === r ? "rgba(139,92,246,0.15)" : "var(--vf-bg-glass)",
              color: roleFilter === r ? "#8B5CF6" : "var(--vf-text-secondary)",
              borderColor: roleFilter === r ? "rgba(139,92,246,0.4)" : "var(--vf-border)" }}>
            {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <div className="glass" style={{ overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Last Login</th><th style={{ textAlign: "right" }}>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <motion.tr key={u.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td>
                  <div style={{ fontWeight: 700, color: "var(--vf-text-primary)", fontSize: 14 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: "var(--vf-text-muted)" }}>{u.email}</div>
                </td>
                <td><span style={{ background: `${ROLE_COLORS[u.role as UserRole]}15`, color: ROLE_COLORS[u.role as UserRole], padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>{u.role}</span></td>
                <td><span style={{ color: STATUS_COLORS[u.status as UserStatus], fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>{u.status}</span></td>
                <td style={{ fontSize: 12 }}>{u.joined}</td>
                <td style={{ fontSize: 12, color: u.lastLogin === "Never" ? "var(--vf-text-muted)" : undefined }}>{u.lastLogin}</td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button onClick={() => setModal({ mode: "edit", data: { ...u } })}
                      style={{ padding: "6px 10px", background: "rgba(0,212,255,0.1)", color: "var(--vf-cyan)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>✏️</button>
                    <button onClick={() => toggleStatus(u.id)}
                      style={{ padding: "6px 10px", background: u.status === "active" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)", color: u.status === "active" ? "#F59E0B" : "#10B981", border: `1px solid ${u.status === "active" ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`, borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                      {u.status === "active" ? "🚫" : "✅"}
                    </button>
                    <button onClick={() => setDeleteId(u.id)}
                      style={{ padding: "6px 10px", background: "rgba(244,63,94,0.1)", color: "#F43F5E", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>🗑️</button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => !saved && setModal(null)}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
              onClick={e => e.stopPropagation()}
              className="glass" style={{ width: "100%", maxWidth: 480, padding: 32, maxHeight: "85vh", overflowY: "auto" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginBottom: 24 }}>
                {modal.mode === "create" ? "➕ Add User" : "✏️ Edit User"}
              </h2>
              {saved ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <div style={{ fontWeight: 700, color: "#10B981" }}>Saved!</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                    { label: "Email", key: "email", type: "email", placeholder: "user@flowsphere.io" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--vf-text-secondary)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</label>
                      <input type={f.type} value={(modal.data as any)[f.key] ?? ""} onChange={e => updateField(f.key as any, e.target.value)} placeholder={f.placeholder}
                        style={{ width: "100%", padding: "10px 12px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 9, color: "var(--vf-text-primary)", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  {[
                    { label: "Role", key: "role", options: ["attendee", "admin", "security", "staff"] },
                    { label: "Status", key: "status", options: ["active", "suspended", "pending"] },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--vf-text-secondary)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</label>
                      <select value={(modal.data as any)[f.key] ?? ""} onChange={e => updateField(f.key as any, e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 9, color: "var(--vf-text-primary)", fontSize: 14, outline: "none" }}>
                        {f.options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                      </select>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button onClick={saveUser} style={{ flex: 1, padding: "13px", background: "var(--vf-grad-purple)", color: "white", fontWeight: 700, borderRadius: 10, border: "none", cursor: "pointer" }}>
                      {modal.mode === "create" ? "Add User" : "Save Changes"}
                    </button>
                    <button onClick={() => setModal(null)} style={{ flex: 1, padding: "13px", background: "var(--vf-bg-glass)", color: "var(--vf-text-secondary)", fontWeight: 700, borderRadius: 10, border: "1px solid var(--vf-border)", cursor: "pointer" }}>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()} className="glass" style={{ padding: 32, textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Delete User?</h2>
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
