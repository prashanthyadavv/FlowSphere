"use client";
import { GATE_THROUGHPUT, PARKING_ZONES } from "@/lib/mockData";
import { useDemoStore } from "@/lib/store/demoStore";

export default function GatesPage() {
  const { isDemoMode } = useDemoStore();
  const gatesData = isDemoMode ? GATE_THROUGHPUT : [];
  const parkingData = isDemoMode ? PARKING_ZONES : [];
  return (
    <div style={{ maxWidth: 1200 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 24 }}>🅿️ Gates & Parking Operations</h1>
      
      <div className="glass" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Gate Throughput</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {gatesData.length > 0 ? gatesData.map(g => (
            <div key={g.gate} style={{ textAlign: "center", padding: "24px 16px", background: "var(--vf-bg-glass)", borderRadius: 12, border: "1px solid var(--vf-border)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: g.rate > 90 ? "#10B981" : "#F59E0B" }}>{g.rate}%</div>
              <div style={{ fontWeight: 700, fontSize: 16, margin: "8px 0 4px" }}>{g.gate}</div>
              <div style={{ fontSize: 13, color: "var(--vf-text-muted)" }}>{g.scanned.toLocaleString()} / {g.expected.toLocaleString()}</div>
              <div className="progress-bar-track" style={{ height: 6, marginTop: 12 }}>
                <div className="progress-bar-fill" style={{ width: `${g.rate}%`, background: g.rate > 90 ? "#10B981" : "#F59E0B" }} />
              </div>
            </div>
          )) : <div style={{ textAlign: "center", color: "var(--vf-text-muted)", fontSize: 13, padding: "20px 0", gridColumn: "1 / -1" }}>No gate data available</div>}
        </div>
      </div>

      <div className="glass" style={{ padding: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Parking Availability</h2>
        <table className="data-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Zone Name</th>
              <th style={{ textAlign: "left" }}>Type</th>
              <th style={{ textAlign: "left" }}>Capacity</th>
              <th style={{ textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {parkingData.length > 0 ? parkingData.map(pz => {
              const percent = Math.round(((pz.totalSpaces - pz.availableSpaces) / pz.totalSpaces) * 100);
              let statusColor = "#10B981"; // available
              if (pz.status === "filling") statusColor = "#F59E0B";
              if (pz.status === "full") statusColor = "#F43F5E";
              
              return (
                <tr key={pz.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{pz.name}</div>
                    <div style={{ fontSize: 12, color: "var(--vf-text-muted)" }}>Distance: {pz.distance}</div>
                  </td>
                  <td><span style={{ textTransform: "capitalize", fontSize: 12, background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 4 }}>{pz.type}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="progress-bar-track" style={{ width: 100, height: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${percent}%`, background: statusColor }} />
                      </div>
                      <span style={{ fontSize: 13 }}>{percent}% Full</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: statusColor, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>{pz.status}</span>
                  </td>
                </tr>
              );
            }) : <tr><td colSpan={4} style={{ textAlign: "center", padding: "40px 0", color: "var(--vf-text-muted)" }}>No parking data</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
