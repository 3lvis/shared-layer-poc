<div align="center">
<pre style="font-family:SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;font-size:14px;line-height:1.1;">
 █████╗ ██╗  ██╗██╗███████╗
██╔══██╗╚██╗██╔╝██║██╔════╝
███████║ ╚███╔╝ ██║███████╗
██╔══██║ ██╔██╗ ██║╚════██║
██║  ██║██╔╝ ██╗██║███████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
</pre>
</div>



Axis is an all‑in‑one developer stack: a focused monorepo, a tiny CLI, and a shared domain that lights up web, iOS, and Android together. It’s pragmatic, fast to skim, and ready to ship — not a framework, a toolbox.

Highlights
- One domain shared across apps (`@axis/shared`)
- Web (React), Mobile (React Native), Admin (React) out of the box
- Headless API (Fastify) that speaks the same types
- E2E integration for web (Playwright) + mobile (Detox)
- Axis CLI to create, update, integrate, test, and doctor projects

Why Axis (the Rationale)
- One team, three platforms. Stop forking logic — share types, hooks, and models once.
- Reality beats theory. Ship a feature and have it light up on web and mobile together.
- The loop is tight. Edit `@axis/shared`, hot‑reload in apps, run one command, get green.
- Minimal by design. No yak‑shaving, no mystery stack — simple scripts, clear wiring.
- Ladder of adoption. Start small, add Storybook, Admin workflows, and Deploy when you need them.
- Own your velocity. Axis keeps you moving; you keep full control.

Quick Start
- Install deps: `npm i`
- iOS pods (first time): `cd apps/mobile/ios && pod install && cd -`
- Web: `npm run web` → http://localhost:5173
- Admin: `npm run admin` → http://localhost:5273
- API: `npm run dev:api` → http://localhost:3000
- iOS: `npm run ios` • Android: `npm run android`
- Axis CLI smoke (local): `npm run axis -- test`

Local Verification (End‑to‑End)
- Shared unit tests: `npm --workspace @axis/shared run test`
- Web integration (Playwright): `npm run integrate:web`
- Mobile e2e iOS (Detox): `npm run integrate:ios`
- Mobile e2e Android (Detox): `npm run integrate:android`
- All integrations: `npm run integrate:all`
- API health: `curl http://localhost:3000/health` (after `npm run dev:api`)

Axis CLI
- Create: `npm run axis -- create --dir ../my-apps --scope my-scope --title "My App" --repo my-apps`
- Update from upstream: `npm run axis -- update`
- Integrate on local demo: `npm run axis -- integrate --local`  
  Runs shared unit tests and web e2e using the committed demo in this repo. Use `--withMobile` to include Detox. In restricted environments (no ports), add `--skipWeb`.
- Test (internal smoke): `npm run axis -- test`  
  Same as integrate; intended as a pre‑release gate for the CLI.
- Doctor: `npm run axis -- doctor`

Note: When running the CLI from a published package instead of the repo, pass a template explicitly: `axis test --template <git-url-or-path>`.

Demo Project (Committed)
- This repository serves as the demo Axis project: web, admin, mobile, API, and shared utilities live here.
- Use `npm run axis -- integrate --local` to validate the whole stack locally.

Monorepo Layout
- `apps/web` — customer web app (esbuild)
- `apps/admin` — admin tool for support/ops
- `apps/mobile` — React Native app (iOS/Android)
- `packages/shared` — shared utilities (no domain‑specific logic)
- `services/api` — headless API (Fastify)
- `packages/axis-cli` — Axis CLI (create, update, integrate, test, doctor)

What’s Included Today
- Minimal shared utilities (`useCounter`) used by web/admin/mobile
- Web + Admin apps with esbuild dev/build
- React Native 0.82 with Detox wiring (no sample e2e by default)
- API with `/health` only
- Tests: Vitest (CLI unit tests)

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
- [x] Web, Admin, Mobile, API, Shared utilities wired
- [x] Axis CLI: create, update, integrate, test, doctor
- [x] One‑repo scripts for local dev
Outcome: A working stack you can run locally with a publishable CLI.

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
- [ ] `axis integrate` to orchestrate: typecheck → unit tests → optional e2e when configured
- [ ] Stable ports, health checks, and test artifacts
Outcome: Green means “it works” across surfaces.

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

Releasing the CLI (Publishing)
- Package: `packages/axis-cli` (bin `axis`)
- Bump version: `cd packages/axis-cli && npm version patch`
- Pre‑release gate: run `npm run axis -- test` (uses local template, no network)
- Publish: `npm publish --access public` (from `packages/axis-cli`)
- Usage: `npx @axis/cli create ...` or install globally `npm i -g @axis/cli`

Notes
- We keep RN internal project names stable (“mobile”) to avoid native churn.
- React version pin: validate React 19 with RN 0.82; fallback to 18 if needed.

Let’s build the next all‑in‑one way of shipping product — fast, friendly, and owned by you.
