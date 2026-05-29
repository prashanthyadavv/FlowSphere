"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { role: "user" | "ai"; text: string; time: Date };

const QUICK_ACTIONS = [
  "Where is my seat?", "Shortest food queue?", "Nearest restroom?",
  "How to exit quickly?", "SOS — I need help", "Parking status?",
];

const AI_RESPONSES: Record<string, string> = {
  "where is my seat": "Your seat is at **Section N-23, Row G, Seat 14** — Upper Tier, Central Pitch View. 🎫\n\nThe fastest route: **Gate A → Upper Tier Staircase 3 → Section N-23**. Estimated 4 minutes from your current location.",
  "shortest food queue": "Currently the shortest food queue is **South Eats** (South Concourse) at just **5 minutes** estimated wait! 🍔\n\nAlternatively, **Spice Bowl** at Gate C has a 10-min wait. Both are far shorter than West Grills (60 min).",
  "nearest restroom": "Nearest restroom to you: **Restroom Block A** — North Stand. Current wait: **33 minutes** (busy).\n\nI recommend **Restroom Block B** (South Stand) with only a **4 minute wait**. It's a 6-minute walk via the East Concourse.",
  "how to exit quickly": "⚡ **Fastest Exit Strategy after Full Time:**\n\n1. Leave 5 minutes before the final whistle\n2. Use **Gate B (South)** — currently lowest congestion\n3. Head toward **Zone Beta parking** (340 spaces available)\n4. Avoid Gate D — critical congestion expected\n\nAI predicts this saves you **~25 minutes** of traffic.",
  "sos": "🚨 **SOS Mode Activated**\n\nI'm alerting the nearest security team to your location.\n\n• **Security Team Alpha** has been notified\n• ETA: ~3 minutes\n• Stay where you are\n\nFor immediate medical emergency: Call **+91-22-VENUE-911**\nFor fire/evacuation: Follow the **green evacuation signs**",
  "parking status": "🅿️ **Current Parking Status:**\n\n• Zone Alpha (North): 87 spaces — FILLING\n• Zone Beta (East): 340 spaces — AVAILABLE ✅\n• Zone Delta (West): 12 spaces — FILLING\n• VIP Premium: 45 spaces — AVAILABLE\n• Zone Gamma (South): FULL 🔴\n\n**Recommended:** Zone Beta (East) for post-match exit.",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const key of Object.keys(AI_RESPONSES)) {
    if (lower.includes(key) || key.split(" ").some(w => lower.includes(w))) {
      return AI_RESPONSES[key];
    }
  }
  return `Thanks for your question! 🤖\n\nI understand you're asking about: "${input}"\n\nFor this specific query, please check the venue information kiosk at Gate A or ask any staff member wearing a blue FlowSphere vest. You can also try asking about:\n\n• Seat location\n• Food queues\n• Restrooms\n• Exit routes\n• Parking`;
}

function formatMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} style={{ margin: "2px 0", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! 👋 I'm FlowSphere — your intelligent stadium assistant.\n\nI can help you with navigation, food queues, parking, emergency assistance, and much more. What do you need?", time: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const aiMsg: Message = { role: "ai", text: getAIResponse(text), time: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🤖 AI Stadium Assistant</h1>
        <p style={{ color: "var(--vf-text-secondary)", fontSize: 14 }}>Multi-language · Voice-ready · Emergency-aware · Always on</p>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {QUICK_ACTIONS.map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid var(--vf-border)", background: "var(--vf-bg-glass)", color: "var(--vf-text-secondary)", backdropFilter: "blur(10px)", transition: "all 0.15s" }}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="glass" style={{ flex: 1, padding: 20, overflowY: "auto", marginBottom: 16 }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", gap: 12, marginBottom: 16, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              {msg.role === "ai" && (
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--vf-grad-cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
              )}
              <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "var(--vf-grad-cyan)" : "var(--vf-bg-secondary)",
                color: msg.role === "user" ? "#050A14" : "var(--vf-text-primary)",
                border: msg.role === "ai" ? "1px solid var(--vf-border)" : "none",
                fontSize: 13, lineHeight: 1.6 }}>
                {formatMarkdown(msg.text)}
                <div style={{ fontSize: 10, marginTop: 6, opacity: 0.6, textAlign: "right" }}>
                  {msg.time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--vf-grad-cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div style={{ padding: "12px 16px", background: "var(--vf-bg-secondary)", borderRadius: 16, border: "1px solid var(--vf-border)" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--vf-cyan)" }}
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask me anything about the venue..."
          style={{ flex: 1, padding: "14px 18px", background: "var(--vf-bg-secondary)", border: "1px solid var(--vf-border)", borderRadius: 12, color: "var(--vf-text-primary)", fontSize: 14, outline: "none", fontFamily: "var(--font-sans)" }} />
        <button onClick={() => sendMessage(input)}
          style={{ padding: "14px 20px", background: "var(--vf-grad-cyan)", color: "#050A14", fontWeight: 700, borderRadius: 12, border: "none", cursor: "pointer", fontSize: 18 }}>→</button>
      </div>
    </div>
  );
}
