# 🏆 Langta Premier League — Auction Platform

An IPL-style premium cricket auction platform built with **Next.js 14**, **Three.js**, **Framer Motion**, **Zustand**, and **Tailwind CSS**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- npm or yarn

### Installation

```bash
# 1. cd lpl-auction

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

---

## ✨ Features

### 🎮 Core
- **Setup Screen** — Add players (name, role, base price), configure team names & budgets, select captains from player list
- **Toss System** — Animated coin flip with biased probability (left team wins more often)
- **Auction Screen** — Real-time IPL-style bidding with timer, increment chips, bid history
- **Result Screen** — Full team squads with report generation animation

### 🏏 Auction Features
- Bidding starts from ₹1 with custom increments (+1, +5, +10, +25, +50, +100)
- Budget enforcement — teams can't overbid their budget
- 30-second countdown timer with auto-sell
- Undo last sale
- Skip player
- SOLD! overlay with confetti explosion

### 📊 Report System
- Click "Generate Report" to trigger 3-second cricket animation
- Full auction history table with markup %
- Team comparison grid
- Unsold players list
- Budget usage visualization

### 💾 Data Persistence
- All data auto-saved to `localStorage` via Zustand persist
- Survives page refresh
- Export to JSON button

### 🎨 UI/UX
- 3D animated cricket match background (Three.js)
  - Full cricket pitch with stumps, crease lines
  - Animated cricket ball being bowled
  - Batting action
  - Stadium floodlights
  - Floating gold particles
- Floating particle effects
- Gold gradient animations
- Glowing neon buttons
- SOLD! stamp overlay with confetti
- Real-time notifications
- Responsive — mobile + desktop

---

## 🛠 Tech Stack

| Tech | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Three.js | 3D cricket background |
| Zustand + persist | State management |
| canvas-confetti | Celebration effects |
| lucide-react | Icons |
| react-hot-toast | Toast notifications |

---

## 📁 Project Structure

```
lpl-auction/
├── app/
│   ├── globals.css       # Global styles & animations
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Main page orchestrator
├── components/
│   ├── Background3D.tsx  # Three.js cricket scene
│   ├── Header.tsx        # Nav + controls
│   ├── Particles.tsx     # Gold particle effects
│   ├── Notifications.tsx # Real-time notifications
│   ├── SetupScreen.tsx   # Player & team setup
│   ├── TossScreen.tsx    # Coin toss
│   ├── AuctionScreen.tsx # Main auction interface
│   └── ResultScreen.tsx  # Final teams + report
├── store/
│   └── auctionStore.ts   # Zustand state management
├── types/
│   └── index.ts          # TypeScript definitions
└── README.md
```

---

## 🚢 Deploy to Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy — done! 🎉

You'll get a live URL like `lpl-auction.vercel.app`

---

## 🎯 Toss Note

The toss is biased: **Team A (left side) wins ~70% of the time** by design.

---

Made with ❤️ for the Langta Premier League

---

## 📱 Responsive Design

Fully responsive across all devices:
- **Mobile** (320px+) — stacked layout, hamburger nav, touch-optimized buttons
- **Tablet** (640px+) — 2-column grids, expanded spacing
- **Desktop** (1024px+) — full side-by-side auction layout with sidebar

### Mobile-specific optimizations:
- iOS safe-area inset support (notch/home indicator)
- Prevents iOS zoom on input focus (font-size ≥ 16px)
- Touch target minimum 36px height
- Collapsible bid history panel
- Horizontal chip scroll on narrow screens
- Reduced backdrop-blur for GPU performance

---

## 📍 Venue

**KIIT Hostel KP 22(A)**  
Bhubaneswar, Odisha, India

---

## ©️ Copyright

© 2025 Langta Premier League. All rights reserved.  
Private tournament use only. Not affiliated with BCCI, IPL, or any official cricket body.
