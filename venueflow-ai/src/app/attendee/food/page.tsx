"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VENDORS } from "@/lib/mockData";
import type { VendorItem, Vendor } from "@/lib/mockData";
import { useDemoStore } from "@/lib/store/demoStore";
import { useDataStore } from "@/lib/store/dataStore";

type CartItem = VendorItem & { vendorName: string; qty: number };

export default function FoodPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState<"all" | "food" | "beverage" | "merchandise">("all");
  const [search, setSearch] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [pickupToken, setPickupToken] = useState<string | null>(null);

  const { isDemoMode } = useDemoStore();
  const { vendors: storedVendors } = useDataStore();

  const baseVendors = isDemoMode ? VENDORS : storedVendors.map(v => ({
    id: v.id,
    name: v.name,
    type: v.type as any,
    zone: "Venue",
    rating: v.rating,
    status: v.status as any,
    items: [] // Admin menu item creation would populate this in a real DB
  }));

  const vendors = filter === "all" ? baseVendors : baseVendors.filter(v => v.type === filter);
  const filtered = search
    ? vendors.map(v => ({ ...v, items: v.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) })).filter(v => v.items.length > 0)
    : vendors;

  const addToCart = (item: VendorItem, vendor: Vendor) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, vendorName: vendor.name, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id: string, delta: number) => setCart(prev =>
    prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0)
  );

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  const placeOrder = () => {
    const token = `TKN-${Math.floor(Math.random() * 900 + 100)}`;
    setPickupToken(token);
    setOrderPlaced(true);
    setCart([]);
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🍔 Food & Beverages</h1>
        <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>Order from any stall · Pre-order for pickup · Skip the queue</p>
      </div>

      {/* Order success */}
      <AnimatePresence>
        {orderPlaced && pickupToken && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ marginBottom: 20, padding: "20px 24px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 14, display: "flex", gap: 20, alignItems: "center" }}>
            <span style={{ fontSize: 40 }}>✅</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#10B981", marginBottom: 4 }}>Order Placed Successfully!</div>
              <div style={{ fontSize: 14, color: "var(--vf-text-secondary)", marginBottom: 6 }}>
                Your pickup token: <strong style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "#10B981" }}>{pickupToken}</strong>
              </div>
              <div style={{ fontSize: 13, color: "var(--vf-text-muted)" }}>Estimated ready in 10–15 minutes. You'll get a notification.</div>
            </div>
            <button onClick={() => setOrderPlaced(false)}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--vf-text-muted)" }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Menu */}
        <div>
          {/* Search + Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search dishes..."
              style={{ flex: 1, minWidth: 200, padding: "10px 14px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 10, color: "var(--vf-text-primary)", fontSize: 14, outline: "none", fontFamily: "var(--font-sans)" }} />
            {["all", "food", "beverage"].map(f => (
              <button key={f} onClick={() => setFilter(f as any)}
                style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1px solid",
                  background: filter === f ? "rgba(0,212,255,0.12)" : "var(--vf-bg-glass)",
                  color: filter === f ? "var(--vf-cyan)" : "var(--vf-text-secondary)",
                  borderColor: filter === f ? "rgba(0,212,255,0.4)" : "var(--vf-border)" }}>
                {f === "all" ? "🔍 All" : f === "food" ? "🍔 Food" : "🥤 Beverages"}
              </button>
            ))}
          </div>

          {filtered.map(vendor => (
            <motion.div key={vendor.id} className="glass" style={{ padding: 24, marginBottom: 16 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{vendor.name}</h2>
                  <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--vf-text-muted)" }}>
                    <span>📍 {vendor.zone}</span>
                    <span>⭐ {vendor.rating}</span>
                    <span className={`status-badge ${vendor.status === "open" ? "status-live" : vendor.status === "busy" ? "status-warning" : "status-danger"}`}>
                      {vendor.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {vendor.items.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {vendor.items.map(item => (
                    <div key={item.id} style={{ padding: "14px 16px", background: "var(--vf-bg-secondary)", borderRadius: 12, border: "1px solid var(--vf-border)", opacity: item.available ? 1 : 0.5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{item.name}</div>
                        {item.popular && <span style={{ fontSize: 10, background: "rgba(245,158,11,0.2)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)", padding: "2px 7px", borderRadius: 100, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 6 }}>🔥 Popular</span>}
                      </div>
                      {item.calories && <div style={{ fontSize: 11, color: "var(--vf-text-muted)", marginBottom: 6 }}>{item.calories} kcal · ~{item.prepTime} min</div>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>₹{item.price}</span>
                        {item.available ? (
                          <button onClick={() => addToCart(item, vendor as any)}
                            style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--vf-cyan)", color: "#050A14", border: "none", fontWeight: 800, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</button>
                        ) : (
                          <span style={{ fontSize: 11, color: "var(--vf-text-muted)", fontWeight: 600 }}>Unavailable</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, background: "var(--vf-bg-secondary)", borderRadius: 12, border: "1px dashed var(--vf-border)" }}>
                  No menu items found.
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Cart */}
        <div style={{ position: "sticky", top: 80, height: "fit-content" }}>
          <div className="glass" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>🛒 Your Order</h2>
              {itemCount > 0 && <span style={{ background: "var(--vf-cyan)", color: "#050A14", fontSize: 12, fontWeight: 800, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{itemCount}</span>}
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "var(--vf-text-muted)" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🛒</div>
                <div style={{ fontSize: 14 }}>Your cart is empty</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Add items from the menu</div>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--vf-border)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "var(--vf-text-muted)" }}>{item.vendorName}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => updateQty(item.id, -1)}
                        style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", color: "var(--vf-text-primary)", cursor: "pointer", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ fontWeight: 700, fontSize: 14, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}
                        style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--vf-cyan)", border: "none", color: "#050A14", cursor: "pointer", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginLeft: 12, minWidth: 60, textAlign: "right" }}>₹{item.price * item.qty}</div>
                  </div>
                ))}

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, marginBottom: 20, paddingTop: 12, borderTop: "2px solid var(--vf-cyan)" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Total</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--vf-cyan)" }}>₹{total}</span>
                </div>

                <button onClick={placeOrder}
                  style={{ width: "100%", padding: "14px", background: "var(--vf-grad-cyan)", color: "#050A14", fontWeight: 800, fontSize: 15, borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "var(--font-display)" }}>
                  ✅ Place Order · Get Token
                </button>
                <button onClick={() => setCart([])}
                  style={{ width: "100%", padding: "10px", marginTop: 8, background: "transparent", color: "var(--vf-text-muted)", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "1px solid var(--vf-border)", cursor: "pointer" }}>
                  Clear Cart
                </button>
              </>
            )}
          </div>

          {/* AI Recommendation */}
          {isDemoMode && (
            <div className="glass" style={{ padding: 20, marginTop: 16, borderLeft: "3px solid var(--vf-cyan)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--vf-cyan)", marginBottom: 8 }}>🤖 AI Recommendation</div>
              <div style={{ fontSize: 13, color: "var(--vf-text-secondary)", lineHeight: 1.5 }}>
                Based on match timing, <strong>half-time in 8 minutes</strong>. Pre-order now to beat the half-time rush!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
