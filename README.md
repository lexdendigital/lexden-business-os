# LEXDEN FORGE — lexden-business-os

Nigeria-first AI Business Operating System. This is the **Day 1 starter repo**:
a dependency-light React + TypeScript + Vite PWA shell with mobile-first UI,
typed domain boundaries, and clearly-labelled demo content everywhere a real
backend/LLM integration will eventually sit.

> **Status:** Day 1 scaffold. No backend is deployed yet. The app runs fully
> client-side with in-memory demo data (see "Demo mode" below).

## Stack

- React 18 + TypeScript + Vite
- `react-router-dom` for routing
- `zod` for validation (shared contract shape for future server-side reuse)
- Vitest + Testing Library for tests
- Hand-written minimal service worker + manifest for PWA installability
  (no PWA plugin dependency, per the "keep dependencies minimal" rule)

Planned (not yet wired up — see `lib/` boundaries):

- Supabase Postgres + Auth with RLS (tenant isolation)
- Cloudflare Pages/Functions or Workers for all server-side logic
- Paystack payment verification (webhook-driven, never client-trusted)
- LLM provider router + agent runtime (typed tools, policy checks, audit log)

## Local run commands

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in values when you have them
cp .env.example .env.local

# 3. Start the dev server
npm run dev
# → opens on http://localhost:5173

# 4. Type-check
npm run typecheck

# 5. Production build
npm run build

# 6. Preview the production build locally
npm run preview

# 7. Run tests
npm test
```

No environment variables are required to run Day 1 — the app detects that
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are unset and runs in **demo
mode** automatically (see below).

## Demo mode

Non-negotiable: business data must be designed for Supabase, not
localStorage, as its long-term source of truth. Since no backend exists yet
on Day 1:

- All business data (business, products, sales, customers) lives in React
  state only, and is **lost on page refresh**. This is intentional — it
  stops Day 1 from quietly becoming a localStorage app that's painful to
  migrate later.
- The only thing persisted to `localStorage` is the light/dark **theme**
  preference, which is a pure UI setting with no business meaning.
- Every AI-generated screen (AI Business Generator, Marketing Studio, AI
  Coach) is clearly labelled with a "🧪 Demo preview — not live AI yet" tag.
  No fake AI claims are made anywhere in the UI copy.
- `lib/api/client.ts` throws a typed `ApiError` (status 501) for any real
  network call attempted in demo mode, and `withDemoFallback` catches that
  specific error to degrade to demo data — so turning off demo mode later
  (`VITE_DEMO_MODE=false` + a real `VITE_API_BASE_URL`) doesn't require
  touching call sites, only the Cloudflare Functions behind them.

## Project structure

```
src/
  types/domain.ts        # Full domain model (mirrors Core data model doc)
  lib/
    api/                  # Cloudflare Functions/Workers boundary (fetch wrapper)
    auth/                 # Supabase Auth boundary (demo session until configured)
    validation/           # Zod schemas, reused client+server later
    analytics/             # Typed event tracking → events table (Day 2+)
    agent/                 # Typed agent tool contract + Day-1 demo generators
    flags/                 # FREE/PRO feature flags + theme preference
    format/                # Deterministic NGN money math (never LLM-computed)
  state/
    businessStore.tsx      # In-memory demo business state (Supabase-shaped)
  components/
    layout/                # AppShell pieces: TopBar, BottomNav
    common/                 # EmptyState, Toast, MetricCard, DemoFlag
  routes/                  # One screen per route, one primary action each
```

## Routes

| Path          | Screen               | Primary action           |
|---------------|-----------------------|---------------------------|
| `/onboarding` | Onboarding             | Start Hustling             |
| `/`           | Dashboard               | (quick actions)            |
| `/sales`      | Sales & bookkeeping     | Parse & Save / Save Sale   |
| `/inventory`  | Inventory               | Add Product                |
| `/customers`  | Customers               | Copy reminder               |
| `/grow`       | AI Generator / Marketing Studio / AI Coach (tabs) | Generate |
| `/settings`   | Settings                | Toggle theme / Export JSON |
| `/about`      | About LEXDEN DIGITAL    | —                          |

Bottom navigation shows 5 primary destinations (Home, Sales, Stock, Grow,
Settings); Customers and About are reached via in-screen links to keep one
primary action per screen and a clean mobile nav.

## Non-negotiables this scaffold already respects

- No API secrets in browser code — `.env.example` only lists `VITE_`-safe
  values; server-only secrets are commented out with a note that they
  belong in the Cloudflare dashboard, never a `VITE_` var.
- Money math lives in `lib/format/money.ts` only, as integer kobo; the UI
  and the demo "AI" never compute a balance themselves.
- Every demo AI output carries `isDemoContent: true` in its return type and
  a visible "🧪 Demo preview" badge in the UI.
- `lib/agent/types.ts` defines the typed-tool / policy-check contract the
  real agent runtime will implement against — no live LLM call exists yet.

## Known limitations (Day 1)

- No persistence: refreshing the browser clears all business data. This is
  intentional (see "Demo mode" above) — Day 2 introduces Supabase as the
  real source of truth and this will change.
- No real authentication — `signInDemo()` creates a local-only profile.
- AI Generator / Marketing Studio / Coach are deterministic demo content
  generators, not live LLM calls.
- No Paystack, WhatsApp, or Nova adapters are implemented yet — only the
  `Production architecture` doc's CONNECTORS layer is reflected in naming,
  not in code.
- Icons are simple inline SVGs, not final brand assets.

## Next day's dependency

Day 2 is expected to introduce the Supabase schema (from the Core data
model doc) with RLS policies, and swap `lib/auth` + a new
`lib/api/supabase.ts` from demo-mode into real calls, without changing any
route-level code — that boundary is the whole point of Day 1's structure.
