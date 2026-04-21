# ✈ Flightify

> Premium flight app for a traveler like you!.

![Flightify](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

---

## Features

### Dashboard
- **Live Stats Panel** — total bookings, active flights, in-flight count, total spent
- **Real-time Flight Ticker** — horizontal scrolling live feed of all tracked flights
- **Animated World Map** — Mercator projection SVG map with moving plane simulations
- **Flight Tracker Carousel** — swipe/click through tracked flights; map syncs to active flight
- **Flight Legend** — click any flight badge to switch the tracker focus instantly
- **My Bookings Widget** — quick view of confirmed/pending bookings
- **Recent Flights** — compact flight card list with status badges
- **World Clock** — live clocks for across the world

### Book a Flight
- **Smart Search Bar** — search by city name, IATA code, or airline
- **Advanced Filter Panel** — filter by:
  - **Price Range** (min/max)
  - **Airlines** (multi-select checkboxes)
  - **Time of Day** (morning / afternoon / evening / night)
  - **Stops** (direct / with stops / any)
  - **Class** (economy / business / first)
  - **From / To** city or code
  - **Date**
- **Flight Cards** — rich cards showing route, airline, duration, stops, price, status
- **Flight Detail Modal** — full detail view with seat map selector
- **Interactive Seat Map** — visual cabin grid, select seats per passenger count
- **Basket / Cart** — add multiple flights, review, remove, or checkout
- **Checkout Flow** — confirms all bookings instantly, adds to profile

### World Map Live Tracker
- **Full-screen World Map** — animated Mercator projection with all tracked flights
- **Animated Planes** — each plane moves in real-time along its bezier route
- **Click-to-Track** — click any plane on the map to select it
- **Carousel Navigation** — prev/next buttons to cycle through tracked flights
- **Legend Grid** — color-coded flight badges; click any to switch tracker view
- **Detail Panel** — shows flight number, progress bar, altitude, speed, coordinates, ETA

### Profile
- **User Card** — avatar, Gold Member status, loyalty miles badge
- **Stats** — total flights, countries visited, total spent
- **Settings Menu** — Personal Info, Payment Methods, Notifications, Security, Preferences
- **Notification Toggles** — toggle flight alerts, check-in reminders, price drops, promos
- **My Bookings** — full booking history with status, seats, class, and total price
- **Loyalty Card** — visual progress bar towards next tier (Gold → Platinum)

---

## Technology

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool & dev server |
| Lucide React | 0.383.x | Icon library |
| Date-fns | 3.x | Date utilities |
| CSS Variables | Native | Design tokens & theming |
| SVG | Native | World map rendering |
| requestAnimationFrame | Native | Plane animation loop |

### Architecture

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.tsx        # Top navigation with tabs
│   ├── FlightCard.tsx    # Flight listing card (full + compact)
│   ├── FlightModal.tsx   # Detail view + seat selection modal
│   ├── WorldMap.tsx      # Animated SVG world map with planes
│   └── WorldClock.tsx    # Live world clock widget
├── pages/              # Tab-level page components
│   ├── Dashboard.tsx     # Main dashboard
│   ├── FlightsPage.tsx   # Search, filter, book
│   ├── TrackerPage.tsx   # Full-screen live tracker
│   └── ProfilePage.tsx   # User profile & bookings
├── hooks/
│   └── useApp.tsx        # Global state context (React Context)
├── data/
│   └── flights.ts        # Mock flight & booking data
├── types/
│   └── index.ts          # TypeScript interfaces
├── App.tsx               # Root component + routing logic
├── main.tsx              # Entry point
└── index.css             # Global styles & design tokens
```

### Design System

- **Colors**: Deep navy background (`#050a14`), lime accent (`#b8ff3c`), cyan accent (`#3cffd4`)
- **Typography**: `Syne` (display/headings) + `DM Sans` (body text)
- **Map Projection**: Mercator (SVG-native, no external map library)
- **Animations**: CSS keyframes + `requestAnimationFrame` for smooth 60fps plane movement
- **State**: React Context API (no Redux/Zustand needed for this scope)

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/flightify.git
cd flightify

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

