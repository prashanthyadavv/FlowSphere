# FlowSphere 🏟️⚡

**Intelligent Crowd Movement & Real-Time Event Experience Platform**

FlowSphere is a production-grade, AI-powered smart venue operating system designed for large-scale sporting and entertainment events with 100,000+ concurrent attendees. By leveraging real-time data, predictive machine learning models, and centralized admin dashboards, FlowSphere transforms complex venue operations into a seamless, highly optimized experience for both attendees and event staff.

### ✨ Key Features
- 🚶‍♂️ **Intelligent Crowd Control:** Real-time density tracking and AI-driven crowd flow predictions to prevent bottlenecks.
- 🍔 **Smart Queues & Vendors:** Live wait times, virtual tokens, pre-ordering, and proactive inventory alerts.
- 🚨 **Emergency & Security:** Instant SOS reporting, automated incident dispatch, and dynamic evacuation routing.
- 🗺️ **Interactive Navigation:** Intelligent, accessible routing and interactive venue maps.

---

## 🚀 Quick Start

```bash
# Navigate to project
cd flowsphere

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 🎭 Live Demo Roles

| Role | URL | Description |
|---|---|---|
| **Attendee** | `/attendee` | Navigate, order food, manage ticket, get alerts |
| **Admin** | `/admin` | Full venue control — crowd, revenue, gates, staff |
| **Security** | `/security` | Incident management, SOS, evacuation control |
| **Vendor** | `/vendor` | Kitchen orders, revenue, inventory dashboard |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FlowSphere Platform                     │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│  Next.js 14  │   NestJS API │  PostgreSQL  │   Redis + TimescaleDB │
│  Frontend    │   Backend    │  Primary DB  │   Cache + Time-series │
├──────────────┴──────────────┴──────────────┴────────────────────┤
│                    WebSocket (Socket.io)                          │
│         /crowd  /queues  /events  /emergency  /notifications      │
├─────────────────────────────────────────────────────────────────┤
│                   Python FastAPI AI Engine                        │
│     Crowd Predictor │ Queue Forecast │ Route Optimizer │ Anomaly  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

### Frontend
- **Next.js 14** (App Router, React Server Components)
- **TypeScript** — full type safety
- **Tailwind CSS** — utility-first with custom design tokens
- **Framer Motion** — production-grade animations
- **Zustand** — lightweight global state management
- **TanStack Query v5** — server state, real-time syncing
- **Recharts** — data visualizations and charts
- **Socket.io Client** — WebSocket real-time updates
- **PWA** — installable, offline-ready

### Backend (Architecture Ready)
- **NestJS** — modular, enterprise TypeScript framework
- **Prisma ORM** — PostgreSQL with type-safe queries
- **Socket.io** — WebSocket server with Redis pub/sub
- **Bull/BullMQ** — background job queues
- **JWT + Passport.js** — authentication & OAuth
- **Redis** — caching, sessions, rate limiting

### AI/Analytics Service
- **Python FastAPI** — microservice for ML inference
- **Crowd Prediction** — LSTM time-series on entry scan rates
- **Queue Forecasting** — gradient boosting on order velocity
- **Anomaly Detection** — statistical threshold analysis
- **Route Optimization** — graph-based + congestion weights

### Infrastructure
- **Docker + Docker Compose** — containerized services
- **Nginx** — reverse proxy + load balancing
- **GitHub Actions** — CI/CD pipeline
- **Kubernetes** — production scaling manifests

---

## 🗂️ Project Structure

```
flowsphere/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout + SEO
│   │   ├── globals.css                 # Design system CSS
│   │   ├── attendee/
│   │   │   ├── layout.tsx              # Attendee shell
│   │   │   ├── page.tsx                # Attendee dashboard
│   │   │   ├── map/page.tsx            # Interactive stadium map
│   │   │   ├── queues/page.tsx         # Queue management
│   │   │   ├── ticket/page.tsx         # Digital ticket + QR
│   │   │   ├── parking/page.tsx        # Smart parking
│   │   │   ├── assistant/page.tsx      # AI chatbot
│   │   │   └── notifications/page.tsx  # Notifications center
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin shell
│   │   │   └── page.tsx                # Admin control center
│   │   ├── security/
│   │   │   ├── layout.tsx              # Security shell
│   │   │   └── page.tsx                # Security operations
│   │   └── vendor/
│   │       ├── layout.tsx              # Vendor shell
│   │       └── page.tsx                # Vendor dashboard
│   └── lib/
│       └── mockData.ts                 # Simulation data engine
└── public/
    └── manifest.json                   # PWA manifest
```

---

## 🧠 System Modules

### 1. Smart Attendee Experience
- **QR/NFC Digital Ticketing** — anti-fraud verified, digital wallet ready
- **Interactive Stadium Map** — SVG with switchable layers (crowd, food, exits, restrooms, accessibility)
- **AI Navigation** — crowd-aware routing, accessibility paths, emergency rerouting
- **Real-Time Heatmaps** — zone density visualization updated every 5 seconds
- **Queue Intelligence** — live wait times, virtual tokens, pre-ordering
- **AI Assistant** — context-aware chatbot for navigation, queues, emergencies

### 2. Admin Control Center
- Live attendee count with 3-second updates
- Attendance trend area chart (actual vs. AI predicted)
- AI prediction alerts with time-to-action windows
- Zone-by-zone crowd status with progress bars
- Live incident feed with severity classification
- Revenue breakdown donut chart
- Gate throughput performance by entry

### 3. Security & Emergency Response
- Live incident management with expand/resolve workflow
- Animated SOS alert modal with dispatch action
- Evacuation mode toggle with PA system activation
- Staff deployment roster with real-time status
- Missing person workflow with CCTV search integration
- Emergency broadcast button for all-staff alerting

### 4. Vendor Operations
- Kitchen queue management with order status transitions
- Inventory tracking with low-stock warnings
- Hourly revenue bar charts
- Order lifecycle: preparing → ready → handed over

### 5. Smart Parking & Transport
- Real-time space availability with fill percentage
- AI exit routing recommendations
- Shuttle and public transport ETA tracking
- Type-based filtering (general, VIP, accessible, EV)

---

## 🤖 AI Analytics Layer

| Model | Purpose | Implementation |
|---|---|---|
| **Crowd Flow Predictor** | 15-30min density forecast | Time-series (LSTM) on entry scan rates |
| **Queue Forecaster** | Wait time per stall | Gradient boosting on order velocity + capacity |
| **Route Optimizer** | Personalized navigation | Graph shortest path + congestion weights |
| **Anomaly Detector** | Panic / unusual clustering | Statistical threshold + rate-of-change |
| **Demand Forecaster** | Pre-event stock planning | Historical regression |
| **Recommendation Engine** | Food/upgrade suggestions | Collaborative filtering |

---

## 🔄 Real-Time WebSocket Architecture

```
Attendee Device → Socket.io Client
    ↓
NestJS Gateway (6 Namespaces)
    /crowd          → density updates, heatmaps (5s intervals)
    /queues         → queue length updates (10s intervals)
    /events         → match stats, scores (live)
    /emergency      → SOS broadcasts (immediate)
    /notifications  → personal alerts (immediate)
    /parking        → space availability (30s intervals)
    ↓
Redis Pub/Sub
    ↓
Analytics Aggregator → PostgreSQL (persist) → AI Engine (30s)
    ↓
Predictions pushed back to all clients via WebSocket
```

---

## 🔐 Security Architecture

| Layer | Protection |
|---|---|
| Transport | HTTPS/WSS with TLS 1.3 |
| Authentication | JWT (15min access + 7d refresh, httpOnly cookies) |
| Authorization | RBAC with 7 roles via NestJS Guards |
| Rate Limiting | Redis-backed per-IP and per-user |
| Input Validation | class-validator on all DTOs |
| SQL Injection | Prisma ORM (parameterized queries only) |
| XSS | Next.js CSP headers + DOMPurify |
| CSRF | SameSite cookies + CSRF tokens |
| Audit Logging | All privileged actions logged with actor + timestamp |

---

## 📊 Database Schema (Key Tables)

```sql
-- Users & Auth
users (id, email, role, mfa_enabled, created_at)
sessions (id, user_id, token_hash, expires_at)

-- Events & Ticketing
events (id, name, venue_id, start_time, capacity)
tickets (id, event_id, user_id, seat_id, qr_code, status)
seats (id, event_id, section, row, number, tier)

-- Crowd Analytics (TimescaleDB)
crowd_metrics (time, zone_id, count, density_level)
crowd_predictions (time, zone_id, predicted_count, confidence)

-- Operations
queues (id, vendor_id, current_depth, avg_service_time)
orders (id, user_id, vendor_id, items_json, status, pickup_token)
vendors (id, name, zone, type, status)

-- Safety
incidents (id, type, severity, location, status, assigned_team_id, created_at)
emergency_logs (id, incident_id, action, actor_id, timestamp)
sos_requests (id, user_id, location_json, status, responded_at)

-- Parking
parking_zones (id, name, total_spaces, type, price)
parking_occupancy (time, zone_id, occupied_spaces)

-- Notifications
notifications (id, user_id, type, title, message, read_at, created_at)
```

---

## 🚀 REST API Endpoints

```
Auth
  POST /api/auth/login
  POST /api/auth/refresh
  POST /api/auth/logout

Crowd
  GET  /api/crowd/zones              → All zone densities
  GET  /api/crowd/heatmap            → Grid heatmap data
  GET  /api/crowd/predictions        → AI forecasts

Queues
  GET  /api/queues                   → All queue statuses
  POST /api/queues/:id/token         → Get virtual token
  POST /api/orders                   → Place pre-order

Ticketing
  GET  /api/tickets/my               → User's ticket
  POST /api/tickets/verify           → QR/NFC verification

Incidents
  GET  /api/incidents                → All incidents [Security+]
  POST /api/incidents                → Report incident
  PUT  /api/incidents/:id/resolve    → Resolve [Security+]
  POST /api/incidents/sos            → SOS trigger

Parking
  GET  /api/parking/zones            → Space availability
  GET  /api/parking/routing/:zoneId  → Exit route suggestions

Analytics [Admin]
  GET  /api/analytics/revenue
  GET  /api/analytics/attendance
  GET  /api/analytics/gates
```

---

## ♿ Accessibility

- ✅ Keyboard navigation on all interactive elements
- ✅ Focus rings (visible outline on all focusable items)
- ✅ High contrast mode via CSS media query
- ✅ Semantic HTML with ARIA labels
- ✅ Accessible routing mode in stadium map
- ✅ Screen reader-friendly status indicators
- ✅ Large text support via CSS custom properties

---

## 📈 Performance Strategy

| Concern | Solution |
|---|---|
| 100k WebSockets | Socket.io cluster + Redis Streams adapter |
| DB performance | Composite indexes + TimescaleDB for time-series |
| API latency | Redis cache with 5s TTL for crowd data |
| Frontend bundle | Next.js code splitting + lazy imports |
| Real-time thrashing | Throttled to 5s intervals to prevent UI churn |
| Images | Next.js Image component + CDN delivery |
| Offline | PWA service worker with offline fallback |

---

## ⚠️ Known Limitations & Honest Tradeoffs

| Area | Limitation |
|---|---|
| **AI Models** | Simulated with realistic algorithms. Real models need historical training data (~2-3 events minimum) |
| **WebSockets** | Frontend uses simulated real-time (setInterval). Full Socket.io needs the NestJS backend running |
| **Authentication** | Demo mode with no auth. JWT + RBAC architecture is documented and ready to implement |
| **Mobile** | Desktop-first layout. Full mobile responsiveness requires responsive CSS breakpoints |
| **CCTV** | Placeholder UI only. Computer vision for panic detection requires hardware integration |
| **Payment** | Pre-order UI is complete; payment gateway (Razorpay/Stripe) integration is pending |

---

## 🗺️ Deployment Roadmap

| Phase | Milestone | Duration |
|---|---|---|
| **MVP** | Core frontend + simulated data + basic ops | Week 1-4 |
| **Pilot Venue** | NestJS backend + PostgreSQL + Redis deployed to one stadium | Month 2-3 |
| **Beta Testing** | Real WebSocket data + mobile optimization + load testing | Month 4-5 |
| **Multi-Stadium** | Kubernetes scaling + multi-tenant architecture | Month 6-9 |
| **Global** | Edge computing + CDN + international compliance | Month 10-12 |

---

## 🐳 Docker Compose (Production)

```yaml
services:
  web:
    build: ./apps/web
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://api:4000
      - NEXT_PUBLIC_WS_URL=ws://api:4000

  api:
    build: ./apps/api
    ports: ["4000:4000"]
    depends_on: [postgres, redis]
    environment:
      - DATABASE_URL=postgresql://postgres:secret@postgres:5432/flowsphere
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}

  postgres:
    image: timescale/timescaledb:latest-pg16
    volumes: ["pgdata:/var/lib/postgresql/data"]
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=flowsphere

  redis:
    image: redis:7-alpine
    volumes: ["redisdata:/data"]

  ai-engine:
    build: ./services/ai-engine
    ports: ["8000:8000"]

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes: ["./infra/nginx/nginx.conf:/etc/nginx/nginx.conf"]

volumes:
  pgdata:
  redisdata:
```

---

## 📄 License

MIT License — Built for the FlowSphere Platform Demo.

---

*Built with ❤️ using Next.js · NestJS · PostgreSQL · Redis · Socket.io · Framer Motion*
