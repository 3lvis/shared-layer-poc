```
      _    __  __  _____
     / \  |  \/  || ____|
    / _ \ | |\/| ||  _|
   / ___ \| |  | || |___
  /_/   \_\_|  |_||_____|

         Axis CLI & Monorepo
   Build once. Ship web, iOS, Android.
```

Axis is an all‑in‑one developer stack: a focused monorepo, a tiny CLI, and a shared domain that lights up web, iOS, and Android together. It’s pragmatic, fast to skim, and ready to ship — not a framework, a toolbox.

Highlights
- One domain shared across apps (`@axis/shared`)
- Web (React), Mobile (React Native), Admin (React) out of the box
- Headless API (Fastify) that speaks the same types
- E2E integration for web (Playwright) + mobile (Detox)
- Axis CLI to create, update, and doctor projects

Quick Start
- Install deps: `npm i`
- iOS pods (first time): `cd apps/mobile/ios && pod install && cd -`
- Web: `npm run web` → http://localhost:5173
- Admin: `npm run admin` → http://localhost:5273
- API: `npm run dev:api` → http://localhost:3000
- iOS: `npm run ios` • Android: `npm run android`
- Integration: web `npm run integrate:web` • iOS `npm run integrate:ios` • Android `npm run integrate:android` • All `npm run integrate:all`

Axis CLI
- Create: `npm run axis -- create --dir ../my-apps --scope my-scope --title "My App" --repo my-apps`
- Update from upstream: `npm run axis -- update`
- Doctor: `npm run axis -- doctor`

Monorepo Layout
- `apps/web` — customer web app (esbuild)
- `apps/admin` — admin tool for support/ops
- `apps/mobile` — React Native app (iOS/Android)
- `packages/shared` — shared types, hooks, pure logic
- `services/api` — headless API (Fastify)
- `packages/axis-cli` — Axis CLI (create, update, doctor)

What’s Included Today
- Shared cart domain + React hook used by web/admin/mobile
- Web + Admin apps with esbuild dev/build
- React Native 0.82 with Detox e2e wiring
- API with `/health`, `/products`, `/cart/total`
- Tests: Vitest (shared), Playwright (web), Detox (mobile)

Requirements
- Node 18+
- iOS: Xcode + CocoaPods (for RN)
- Android: SDK (API 34) + JDK 17 + emulator
- Browsers for Playwright: `npx playwright install`

Troubleshooting (fast)
- Watchman noise: `npm run fix:watchman`
- iOS pods: `cd apps/mobile/ios && pod install`
- Android SDK path: write `apps/mobile/android/local.properties`

Roadmap (Functional Releases)

Release 0 — Today: The Base (shippable)
- [x] Web, Admin, Mobile, API, Shared domain wired
- [x] Web e2e (Playwright) and mobile e2e (Detox)
- [x] Axis CLI: create, update, doctor
- [x] One‑repo scripts for local dev
Outcome: A working stack you can run end‑to‑end locally.

Release 1 — Storybook + RN on Web
- [ ] Add `apps/storybook` (Storybook 8, Vite)
- [ ] Map `react-native` → `react-native-web` inside Storybook only
- [ ] Extract `packages/ui-native` with example components and stories
Outcome: A living component catalog for both platforms.

Release 2 — Shared Network + Admin Flows
- [ ] Add typed API client in `@axis/shared` (fetch wrapper + models)
- [ ] Wire Admin to real API use‑cases (search, CRUD, support flows)
- [ ] Unit tests for API client + Admin components
Outcome: Support can resolve real customer issues from Admin.

Release 3 — One‑Command Integration
- [ ] `axis verify` (or `npm run verify`) to orchestrate: shared unit → API unit → start API → web e2e → mobile e2e
- [ ] Stable ports, health checks, and test artifacts
Outcome: Green means “it works” across web, iOS, Android.

Release 4 — Hetzner Deploy (Infra-as-Code)
- [ ] Dockerfile(s) + Compose for API/web
- [ ] Terraform (hcloud) to provision VM, firewall, networking
- [ ] Caddy/Traefik for TLS, zero‑downtime deploys
Outcome: Push to Hetzner with a single command.

Release 5 — Observability + Security
- [ ] Structured logs and basic metrics on API
- [ ] Error reporting and health/readiness endpoints
- [ ] CI gate: typecheck, unit, e2e, artifacts
Outcome: Operable in production with confidence.

Release 6 — Upgrades & Templates
- [ ] `axis upgrade` for safe template updates + dep bumps
- [ ] Documented extension points (plugins/presets)
Outcome: Teams stay current without churn.

Notes
- We keep RN internal project names stable (“mobile”) to avoid native churn.
- React version pin: validate React 19 with RN 0.82; fallback to 18 if needed.

Let’s build the next all‑in‑one way of shipping product — fast, friendly, and owned by you.
