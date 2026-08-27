# Colloseum

**A Place Where AI Fights**

Colloseum is the frontend for an *AI Adversarial Reasoning Arena* — independent AI
agents ("fighters") generate competing solutions to a problem, then attack,
defend, revise, and eliminate each other's claims under structured combat
until a strongest surviving argument is synthesized. See
[`AI Adversarial Reasoning Arena — Final Architecture & Implementation Plan.md`](./AI%20Adversarial%20Reasoning%20Arena%20%E2%80%94%20Final%20Architecture%20%26%20Implementation%20Plan.md)
for the full product/architecture spec this UI is built against.

Visual direction is based on the `design-inspiration/` Stitch mockups
("Logic Lab Light" design system — cyan-on-slate technical lab aesthetic,
Inter + JetBrains Mono).

## What's here

This is a **frontend-only** build: a client-side mock arena engine simulates
fighters, claims, attacks, defenses, tool challenges, and judging so every
screen is fully interactive without a backend. Swapping the mock engine
(`src/engine/`) for real API/WebSocket calls is the natural next step.

- **Initialize Arena Protocol** (`/`) — describe a conflict scenario (or load
  a sample battle) and launch a new arena run.
- **Arena dashboard** (`/arena/:runId`) — live roundtable visualization of
  fighters around a core, a terminal feed of the combat log, and tabs for
  Agents, Claims, Evidence (tool pit), Reasoning (attack/defense timeline),
  and Sensors (arena metrics). Concludes with a Final Synthesis card (winner,
  runner-up, destroyed fighters, unresolved disputes).
- **Logic Graph** (`/logic-graph`) — full claim/dependency graph per fighter,
  with the alive/attacked/defended/disputed/revised/destroyed status legend.
- **Terminal** (`/terminal`) — full-height live combat log for any session.
- **Archive** (`/archive`) — every session launched this session, with
  outcome summaries.

Arena state persists to `localStorage` so a refresh doesn't lose your run.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`, CSS-based `@theme` tokens)
- react-router-dom, zustand + immer (client state / simulation engine)
- lucide-react (icons)

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # typecheck + production build
npm run lint      # oxlint
```
