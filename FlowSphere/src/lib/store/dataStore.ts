import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminUser = { id: string; name: string; email: string; role: string; status: string; joined: string; lastLogin: string; gate?: string; };
export type VenueZone = { id: string; name: string; type: string; capacity: number; level: string; gate: string; status: string; features: string; };
export type Vendor = { id: string; name: string; type: string; zone: string; gate: string; rating: number; status: string; currentOrders: number; revenue: number; items?: any[]; };
export type EventItem = { id: string; name: string; venue: string; sport: string; date: string; time: string; capacity: number; ticketsSold: number; status: string; teams: string; };

interface DataState {
  users: AdminUser[];
  zones: VenueZone[];
  vendors: Vendor[];
  events: EventItem[];
  addUser: (user: AdminUser) => void;
  updateUser: (id: string, user: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;

  addZone: (zone: VenueZone) => void;
  updateZone: (id: string, zone: Partial<VenueZone>) => void;
  deleteZone: (id: string) => void;

  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  addEvent: (event: EventItem) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      users: [],
      zones: [],
      vendors: [],
      events: [],
      addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
      updateUser: (id, updates) => set((state) => ({ users: state.users.map(u => u.id === id ? { ...u, ...updates } : u) })),
      deleteUser: (id) => set((state) => ({ users: state.users.filter(u => u.id !== id) })),
      
      addZone: (zone) => set((state) => ({ zones: [zone, ...state.zones] })),
      updateZone: (id, updates) => set((state) => ({ zones: state.zones.map(z => z.id === id ? { ...z, ...updates } : z) })),
      deleteZone: (id) => set((state) => ({ zones: state.zones.filter(z => z.id !== id) })),
      
      addVendor: (vendor) => set((state) => ({ vendors: [vendor, ...state.vendors] })),
      updateVendor: (id, updates) => set((state) => ({ vendors: state.vendors.map(v => v.id === id ? { ...v, ...updates } : v) })),
      deleteVendor: (id) => set((state) => ({ vendors: state.vendors.filter(v => v.id !== id) })),
      
      addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
      updateEvent: (id, updates) => set((state) => ({ events: state.events.map(e => e.id === id ? { ...e, ...updates } : e) })),
      deleteEvent: (id) => set((state) => ({ events: state.events.filter(e => e.id !== id) })),
    }),
    {
      name: "flowsphere-admin-data",
    }
  )
);
