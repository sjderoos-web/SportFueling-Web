# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build → dist/
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test runner is configured yet.

## Architecture

**FuelPad** is a sport nutrition planning app. All state is persisted in `localStorage` via Zustand (`fuelpad-storage` key). There is no backend — everything is computed client-side.

### Data flow

```
mockData.js  →  useStore.js (Zustand)  →  pages
                     ↑
             nutritionCalc.js (pure functions)
```

- `src/data/mockData.js` — static reference data: `TRAINING_TYPES` (with `intensityFactor` 0–1), `MEALS` (keyed by slot: breakfast/lunch/dinner/pre_workout/during_workout/post_workout/snack), default week schedule, seed weight history.
- `src/store/useStore.js` — single Zustand store. Shape: `{ profile, schedule, weights, activeMealPlanDay }`. Schedule is a 7-element array indexed Mon–Sun (index 0 = Monday, computed as `(new Date().getDay() + 6) % 7`).
- `src/utils/nutritionCalc.js` — pure calculation functions. `calcDailyTargets()` is the core: Mifflin-St Jeor BMR × 1.4 TDEE + MET-based training kcal, with a 300 kcal deficit cap for `goalMode === 'lose'`. Macro split is dynamic: carb % scales with `intensityFactor` (45–60%).

### Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `Dashboard.jsx` | Today's targets based on today's schedule entry |
| `/training` | `Training.jsx` | Editable weekly schedule; inline macro preview per day |
| `/meals` | `MealPlan.jsx` | Day-picker + meal slot selection; slots are conditional (e.g. `during_workout` only shown for sessions ≥ 90 min) |
| `/weight` | `Weight.jsx` | Weight log, Recharts line chart, BMI |
| `/profile` | `Profile.jsx` | Body stats + goal mode (lose/maintain/gain); live weekly kcal preview |

### UI components

Reusable components live in `src/components/ui/`: `Card`, `Badge`, `MacroBar`, `StatPill`. Layout components in `src/components/layout/`: `Layout` (Outlet wrapper), `Sidebar` (desktop), `MobileNav` (fixed bottom bar on mobile).

### Tailwind setup

Uses Tailwind v4 via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed. All styles are utility classes directly in JSX; `src/index.css` only contains `@import "tailwindcss"` and a minimal reset.

### Adding a new training type

Add an entry to `TRAINING_TYPES` in `mockData.js` with a `label`, `color` (maps to Tailwind color names used in `Badge`), and `intensityFactor` (0 = rest, 1 = maximum). It will automatically appear in the Training page select and all calorie calculations.
