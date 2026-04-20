# ✈️ WonderPlan - Smart Travel Planner

**WonderPlan** is a premium, real-world React application designed to help users plan, track, and manage their trips seamlessly. 

> This project was developed as an end-term submission for **Building Web Applications with React**.

---

## 🧠 Problem Statement

**The User:** Travelers handling complex, multi-day itineraries and budgets.

**The Problem:** Planning a trip often involves juggling multiple isolated tools—spreadsheets for budgets, notes apps for itineraries, and scattered emails for dates. There is a lack of an integrated, visually appealing platform specifically tailored for tracking the core components of travel without requiring overwhelming setups.

**The Solution:** WonderPlan centralizes these essentials. Users can create trips, track their specific budget limits, and seamlessly map out their daily itineraries—all within a single, dynamic, beautifully designed interface.

---

## ✨ Key Features

- **Authentication System:** Secure sign-up and login utilizing session persistence.
- **Trip Management Dashboard:** Create and manage distinct trips with custom date ranges and budgets.
- **Interactive Itinerary Builder:** Add daily activities tailored to your trips.
- **Smart Budget Tracking:** Log precise expenses grouped by trip; visual progress bars instantly compare total spending vs. the budget limit.
- **Persistent Storage:** All user, trip, itinerary, and expense data is safely persisted via a simulated asynchronous `localStorage` backend.
- **Premium UI/UX:** Powered by Tailwind CSS and Framer Motion micro-animations for a lush, responsive, and tactile web experience.

---

## 🛠 Tech Stack

- **Framework:** React 19 (via Vite)
- **Routing:** React Router DOM (v7)
- **State Management:** React Context API & Custom Hooks (`useAuth`, `useMemo`, `useCallback`)
- **Styling:** Tailwind CSS (v4)
- **Icons & Animation:** Lucide React & Framer Motion
- **Database/Backend:** Native Browser `localStorage` wrapped in asynchronous Promise-based API services (`authService.js` and `dbService.js`) to mimic precise network latency and states.

---

## 🚀 Setup Instructions

Follow these steps to run the application locally:

### 1. Clone the repository
Ensure you have the project files locally on your machine.
```bash
# If cloned via git
git clone <your-repo-link>
cd affan_final
```

### 2. Install Dependencies
Run the following command in the root directory to install all necessary packages:
```bash
npm install
```

### 3. Start the Development Server
Launch the application:
```bash
npm run dev
```

### 4. Experience the app
Open your browser and navigate to the localhost link provided in your terminal (typically `http://localhost:5173`). Have fun planning!

---

## 🏗 Architecture / Code Quality

This project emphasizes clean separation of concerns and optimal React practices:
- **`src/services/`**: Abstracts all "backend" API interactions and `localStorage` JSON parsing.
- **`src/components/ui/`**: Highly reusable atomic UI components (`Button`, `Modal`, `Card`, `Input`).
- **`src/context/`**: Global state providers (e.g., Auth wrapper bounding).
- **`src/components/layout/`**: `ProtectedRoute` high-order components ensuring standard unauthenticated user redirection.

---

*Built by Affan Khan • Batch 2029*
