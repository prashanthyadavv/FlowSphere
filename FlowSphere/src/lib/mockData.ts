// FlowSphere — Mock Data & Simulation Engine
// Provides realistic real-time simulated data for all modules

export type CrowdZone = {
  id: string;
  name: string;
  capacity: number;
  current: number;
  density: "low" | "medium" | "high" | "critical";
  trend: "up" | "down" | "stable";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type QueueItem = {
  id: string;
  vendorName: string;
  vendorType: "food" | "beverage" | "merchandise" | "restroom";
  zone: string;
  currentQueue: number;
  avgServiceTime: number; // seconds per person
  estimatedWait: number; // minutes
  capacity: number;
  status: "open" | "busy" | "closed";
  position: { x: number; y: number };
};

export type Incident = {
  id: string;
  type: "security" | "crowd" | "fire" | "lost_person" | "infrastructure" | "sos";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  location: string;
  zone: string;
  timestamp: Date;
  status: "open" | "responding" | "resolved";
  assignedTeam?: string;
  lat?: number;
  lng?: number;
};

export type ParkingZone = {
  id: string;
  name: string;
  totalSpaces: number;
  availableSpaces: number;
  distance: string;
  walkTime: string;
  price: string;
  status: "available" | "filling" | "full";
  type: "general" | "vip" | "accessible" | "ev";
};

export type VendorItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  prepTime: number;
  available: boolean;
  popular: boolean;
  calories?: number;
  image?: string;
};

export type Vendor = {
  id: string;
  name: string;
  type: "food" | "beverage" | "merchandise";
  zone: string;
  gate: string;
  rating: number;
  currentOrders: number;
  revenue: number;
  status: "open" | "busy" | "closed";
  items: VendorItem[];
};

export type Notification = {
  id: string;
  type: "info" | "warning" | "success" | "danger" | "promo";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
};

export type MatchStat = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  period: string;
  homePossession: number;
  homeShots: number;
  awayShots: number;
  homeYellowCards: number;
  awayYellowCards: number;
  status: "pre" | "live" | "halftime" | "full";
};

export type AttendeeSeat = {
  section: string;
  row: string;
  seat: string;
  gate: string;
  level: string;
  view: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  zone: string;
  status: "active" | "break" | "incident";
  contact: string;
};

// ─── CROWD ZONES ────────────────────────────────────────────────────────────
export const CROWD_ZONES: CrowdZone[] = [
  { id: "north-stand", name: "North Stand", capacity: 15000, current: 12800, density: "high", trend: "up", x: 150, y: 30, width: 260, height: 70 },
  { id: "south-stand", name: "South Stand", capacity: 15000, current: 7200, density: "medium", trend: "stable", x: 150, y: 360, width: 260, height: 70 },
  { id: "east-stand", name: "East Stand", capacity: 8000, current: 5600, density: "medium", trend: "down", x: 430, y: 110, width: 70, height: 240 },
  { id: "west-stand", name: "West Stand", capacity: 8000, current: 7600, density: "critical", trend: "up", x: 60, y: 110, width: 70, height: 240 },
  { id: "vip-lounge", name: "VIP Lounge", capacity: 2000, current: 850, density: "low", trend: "stable", x: 200, y: 140, width: 80, height: 50 },
  { id: "pitch", name: "Pitch", capacity: 0, current: 0, density: "low", trend: "stable", x: 150, y: 110, width: 260, height: 240 },
  { id: "gate-a", name: "Gate A (North)", capacity: 5000, current: 3200, density: "high", trend: "up", x: 245, y: 5, width: 80, height: 20 },
  { id: "gate-b", name: "Gate B (South)", capacity: 5000, current: 1100, density: "low", trend: "down", x: 245, y: 435, width: 80, height: 20 },
  { id: "gate-c", name: "Gate C (East)", capacity: 5000, current: 2400, density: "medium", trend: "stable", x: 505, y: 210, width: 20, height: 80 },
  { id: "gate-d", name: "Gate D (West)", capacity: 5000, current: 4700, density: "critical", trend: "up", x: 35, y: 210, width: 20, height: 80 },
  { id: "concourse-n", name: "North Concourse", capacity: 3000, current: 2100, density: "high", trend: "up", x: 150, y: 100, width: 260, height: 10 },
  { id: "concourse-s", name: "South Concourse", capacity: 3000, current: 900, density: "low", trend: "stable", x: 150, y: 350, width: 260, height: 10 },
];

// ─── QUEUES ─────────────────────────────────────────────────────────────────
export const QUEUES: QueueItem[] = [
  { id: "q1", vendorName: "Zap Burgers", vendorType: "food", zone: "North Concourse", currentQueue: 34, avgServiceTime: 90, estimatedWait: 51, capacity: 50, status: "busy", position: { x: 0.3, y: 0.15 } },
  { id: "q2", vendorName: "Hydration Hub", vendorType: "beverage", zone: "North Concourse", currentQueue: 12, avgServiceTime: 30, estimatedWait: 6, capacity: 50, status: "open", position: { x: 0.55, y: 0.15 } },
  { id: "q3", vendorName: "Spice Bowl", vendorType: "food", zone: "East Concourse", currentQueue: 8, avgServiceTime: 75, estimatedWait: 10, capacity: 40, status: "open", position: { x: 0.75, y: 0.45 } },
  { id: "q4", vendorName: "West Grills", vendorType: "food", zone: "West Concourse", currentQueue: 45, avgServiceTime: 80, estimatedWait: 60, capacity: 50, status: "busy", position: { x: 0.15, y: 0.45 } },
  { id: "q5", vendorName: "South Eats", vendorType: "food", zone: "South Concourse", currentQueue: 5, avgServiceTime: 60, estimatedWait: 5, capacity: 40, status: "open", position: { x: 0.45, y: 0.8 } },
  { id: "q6", vendorName: "Restroom Block A", vendorType: "restroom", zone: "North Stand", currentQueue: 22, avgServiceTime: 90, estimatedWait: 33, capacity: 30, status: "busy", position: { x: 0.35, y: 0.1 } },
  { id: "q7", vendorName: "Restroom Block B", vendorType: "restroom", zone: "South Stand", currentQueue: 3, avgServiceTime: 90, estimatedWait: 4, capacity: 30, status: "open", position: { x: 0.65, y: 0.9 } },
  { id: "q8", vendorName: "VIP Bar", vendorType: "beverage", zone: "VIP Lounge", currentQueue: 6, avgServiceTime: 45, estimatedWait: 5, capacity: 20, status: "open", position: { x: 0.5, y: 0.45 } },
];

// ─── PARKING ────────────────────────────────────────────────────────────────
export const PARKING_ZONES: ParkingZone[] = [
  { id: "p1", name: "Zone Alpha (North)", totalSpaces: 1200, availableSpaces: 87, distance: "200m", walkTime: "3 min", price: "₹300", status: "filling", type: "general" },
  { id: "p2", name: "Zone Beta (East)", totalSpaces: 800, availableSpaces: 340, distance: "450m", walkTime: "6 min", price: "₹200", status: "available", type: "general" },
  { id: "p3", name: "Zone Delta (West)", totalSpaces: 600, availableSpaces: 12, distance: "350m", walkTime: "5 min", price: "₹300", status: "filling", type: "general" },
  { id: "p4", name: "VIP Premium", totalSpaces: 200, availableSpaces: 45, distance: "50m", walkTime: "1 min", price: "₹1500", status: "available", type: "vip" },
  { id: "p5", name: "Accessible Zone", totalSpaces: 120, availableSpaces: 68, distance: "100m", walkTime: "2 min", price: "Free", status: "available", type: "accessible" },
  { id: "p6", name: "EV Charging Bay", totalSpaces: 80, availableSpaces: 22, distance: "300m", walkTime: "4 min", price: "₹500 incl. charge", status: "filling", type: "ev" },
  { id: "p7", name: "Zone Gamma (South)", totalSpaces: 1000, availableSpaces: 0, distance: "600m", walkTime: "8 min", price: "₹200", status: "full", type: "general" },
];

// ─── VENDORS ────────────────────────────────────────────────────────────────
export const VENDORS: Vendor[] = [
  {
    id: "v1", name: "Zap Burgers", type: "food", zone: "North Concourse", gate: "Gate A", rating: 4.3, currentOrders: 34, revenue: 142600, status: "busy",
    items: [
      { id: "i1", name: "Classic Zap Burger", category: "Burgers", price: 280, prepTime: 8, available: true, popular: true, calories: 520 },
      { id: "i2", name: "Double Stack", category: "Burgers", price: 380, prepTime: 10, available: true, popular: false, calories: 720 },
      { id: "i3", name: "Crispy Chicken Burger", category: "Burgers", price: 320, prepTime: 9, available: false, popular: true, calories: 580 },
      { id: "i4", name: "Loaded Fries", category: "Sides", price: 150, prepTime: 5, available: true, popular: true, calories: 380 },
    ]
  },
  {
    id: "v2", name: "Spice Bowl", type: "food", zone: "East Concourse", gate: "Gate C", rating: 4.7, currentOrders: 8, revenue: 78400, status: "open",
    items: [
      { id: "i5", name: "Butter Chicken Bowl", category: "Indian", price: 320, prepTime: 6, available: true, popular: true, calories: 480 },
      { id: "i6", name: "Paneer Tikka Wrap", category: "Indian", price: 250, prepTime: 5, available: true, popular: false, calories: 420 },
      { id: "i7", name: "Dal Makhani + Rice", category: "Indian", price: 280, prepTime: 7, available: true, popular: true, calories: 520 },
    ]
  },
  {
    id: "v3", name: "Hydration Hub", type: "beverage", zone: "North Concourse", gate: "Gate A", rating: 4.1, currentOrders: 12, revenue: 34200, status: "open",
    items: [
      { id: "i8", name: "Coke 500ml", category: "Soft Drinks", price: 80, prepTime: 1, available: true, popular: true },
      { id: "i9", name: "Beer Pint", category: "Alcohol", price: 280, prepTime: 2, available: true, popular: true },
      { id: "i10", name: "Lemon Iced Tea", category: "Mocktails", price: 120, prepTime: 2, available: true, popular: false },
      { id: "i11", name: "Energy Drink", category: "Energy", price: 160, prepTime: 1, available: true, popular: false },
    ]
  },
];

// ─── INCIDENTS ───────────────────────────────────────────────────────────────
export const INCIDENTS: Incident[] = [
  { id: "inc1", type: "crowd", severity: "high", title: "High Crowd Density", description: "West Stand approaching critical capacity. Gate D congestion observed.", location: "West Stand / Gate D", zone: "West", timestamp: new Date(Date.now() - 8 * 60000), status: "responding", assignedTeam: "Crowd Control Alpha" },
  { id: "inc3", type: "lost_person", severity: "medium", title: "Lost Child Report", description: "Child, approx. 8 years old, separated from family. Blue jersey.", location: "North Concourse near Gate A", zone: "North", timestamp: new Date(Date.now() - 22 * 60000), status: "open", assignedTeam: "Security Beta" },
  { id: "inc4", type: "security", severity: "low", title: "Unauthorized Area Attempt", description: "Attendee attempted to access restricted media zone.", location: "Media Zone Entrance", zone: "East", timestamp: new Date(Date.now() - 35 * 60000), status: "resolved", assignedTeam: "Security Alpha" },
  { id: "inc5", type: "infrastructure", severity: "low", title: "Turnstile Malfunction", description: "Gate B turnstile 3 stopped responding. Manual override active.", location: "Gate B, Turnstile 3", zone: "South", timestamp: new Date(Date.now() - 45 * 60000), status: "responding", assignedTeam: "Technical Support" },
];

// ─── STAFF ───────────────────────────────────────────────────────────────────
export const STAFF_MEMBERS: StaffMember[] = [
  { id: "s1", name: "Arjun Mehta", role: "Security Lead", zone: "Gate A", status: "active", contact: "+91-9876543210" },
  { id: "s3", name: "Ravi Kumar", role: "Crowd Control", zone: "West Stand", status: "active", contact: "+91-9876543212" },
  { id: "s4", name: "Divya Nair", role: "Customer Experience", zone: "South Concourse", status: "active", contact: "+91-9876543213" },
  { id: "s5", name: "Suresh Pillai", role: "Gate Supervisor", zone: "Gate D", status: "active", contact: "+91-9876543214" },
  { id: "s6", name: "Aisha Khan", role: "Emergency Coordinator", zone: "Control Room", status: "active", contact: "+91-9876543215" },
  { id: "s7", name: "Vikram Singh", role: "Technical Support", zone: "Gate B", status: "incident", contact: "+91-9876543216" },
];

// ─── MATCH STATS ─────────────────────────────────────────────────────────────
export const MATCH_STATS: MatchStat = {
  homeTeam: "Mumbai Indians",
  awayTeam: "Delhi Capitals",
  homeScore: 3,
  awayScore: 1,
  minute: 67,
  period: "2nd Half",
  homePossession: 58,
  homeShots: 12,
  awayShots: 7,
  homeYellowCards: 1,
  awayYellowCards: 2,
  status: "live",
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "warning", title: "Queue Alert", message: "West Grills queue is 60 min wait. Try Spice Bowl (East) — only 10 min!", timestamp: new Date(Date.now() - 2 * 60000), read: false, actionLabel: "View alternatives", actionUrl: "/attendee/queues" },
  { id: "n2", type: "info", title: "Smart Route Suggestion", message: "Gate D is congested. Use Gate C for a faster exit after the match.", timestamp: new Date(Date.now() - 5 * 60000), read: false, actionLabel: "Get directions", actionUrl: "/attendee/map" },
  { id: "n3", type: "success", title: "Order Ready! 🎉", message: "Your Butter Chicken Bowl from Spice Bowl is ready for pickup at counter #3.", timestamp: new Date(Date.now() - 8 * 60000), read: true, actionLabel: "View order" },
  { id: "n4", type: "promo", title: "Seat Upgrade Available ⭐", message: "A VIP seat (Sec. VIP-A, Row 2) is available. Upgrade for ₹1,500.", timestamp: new Date(Date.now() - 20 * 60000), read: false, actionLabel: "Upgrade now" },
  { id: "n5", type: "info", title: "Parking Update", message: "Zone Alpha is 93% full. Zone Beta (East) has 340 available spaces.", timestamp: new Date(Date.now() - 30 * 60000), read: true },
];

// ─── ATTENDEE SEAT ───────────────────────────────────────────────────────────
export const MY_SEAT: AttendeeSeat = {
  section: "N-23",
  row: "G",
  seat: "14",
  gate: "Gate A",
  level: "Upper Tier",
  view: "Central Pitch View",
};

// ─── ANALYTICS HELPERS ───────────────────────────────────────────────────────
export function getDensityColor(density: CrowdZone["density"]): string {
  switch (density) {
    case "low": return "rgba(16, 185, 129, 0.55)";
    case "medium": return "rgba(245, 158, 11, 0.55)";
    case "high": return "rgba(249, 115, 22, 0.6)";
    case "critical": return "rgba(244, 63, 94, 0.7)";
    default: return "rgba(255,255,255,0.1)";
  }
}

export function getDensityLabel(density: CrowdZone["density"]): string {
  switch (density) {
    case "low": return "Low";
    case "medium": return "Moderate";
    case "high": return "High";
    case "critical": return "Critical";
    default: return "Unknown";
  }
}

export function getOccupancyPercent(zone: CrowdZone): number {
  if (zone.capacity === 0) return 0;
  return Math.round((zone.current / zone.capacity) * 100);
}

export function formatWait(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

// ─── SIMULATED CHART DATA ────────────────────────────────────────────────────
export const CROWD_TIMELINE = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const base = hour < 8 ? 0 : hour < 12 ? (hour - 8) * 3000 : hour < 14 ? 12000 + (hour - 12) * 8000 : hour < 18 ? 28000 + Math.sin((hour - 14) * 0.5) * 4000 : hour < 20 ? 45000 - (hour - 18) * 2000 : 41000 - (hour - 20) * 5000;
  return {
    time: `${hour.toString().padStart(2, "0")}:00`,
    attendees: Math.max(0, Math.round(base + (Math.random() - 0.5) * 1500)),
    capacity: 52000,
    predicted: Math.max(0, Math.round(base * 1.05 + 500)),
  };
});


export const QUEUE_HISTORY = Array.from({ length: 12 }, (_, i) => ({
  time: `${(14 + i * 0.5).toFixed(1)}:00`,
  "Zap Burgers": Math.round(15 + Math.sin(i * 0.8) * 15 + Math.random() * 10),
  "West Grills": Math.round(20 + Math.sin(i * 0.5 + 1) * 20 + Math.random() * 8),
  "Spice Bowl": Math.round(5 + Math.sin(i * 1.2) * 5 + Math.random() * 5),
  "Hydration Hub": Math.round(8 + Math.sin(i * 0.7 + 2) * 6 + Math.random() * 4),
}));

export const GATE_THROUGHPUT = [
  { gate: "Gate A", scanned: 28400, expected: 30000, rate: 94.7 },
  { gate: "Gate B", scanned: 12100, expected: 15000, rate: 80.7 },
  { gate: "Gate C", scanned: 18900, expected: 20000, rate: 94.5 },
  { gate: "Gate D", scanned: 24600, expected: 25000, rate: 98.4 },
];

export const AI_PREDICTIONS = [
  { zone: "West Stand", currentLoad: 95, predictedPeak: 99, timeToAction: "8 min", action: "Open overflow corridor D2" },
  { zone: "Gate A Queue", currentLoad: 78, predictedPeak: 92, timeToAction: "15 min", action: "Activate additional turnstiles" },
  { zone: "North Concourse", currentLoad: 70, predictedPeak: 88, timeToAction: "22 min", action: "Pre-position staff for crowd control" },
  { zone: "Parking Zone Alpha", currentLoad: 93, predictedPeak: 100, timeToAction: "5 min", action: "Divert traffic to Zone Beta" },
];
