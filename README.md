# shared-layer-poc

Share one TypeScript “domain” between a React web app and a React Native app. Tiny, practical, and fast to skim. This is a reference, not a framework.

## Local Integration Runs (Web, iOS, Android)
Validates the same happy path end‑to‑end locally: “add product → cart total updates”. Minimal deps; npm‑only.

Scripts
- Units (shared only): `npm test`
- Web: `npm run integrate:web`
- iOS (simulator): `npm run integrate:ios`
- Android (emulator): `npm run integrate:android`
- All (sequential): `npm run integrate:all`
 - Fix Watchman recrawl noise: `npm run fix:watchman`

Requirements
- Node 18+
- Xcode + iOS Simulator, CocoaPods
- Android SDK (API 34), JDK 17, an API 34 emulator image
 - Detox iOS helper: `applesimutils` (Homebrew)

One‑time setup
- `npm i`
- `cd apps/mobile/ios && pod install && cd -`
- Ensure an Android emulator for API 34 exists and is running (e.g. “Pixel_6_API_34”).
- For Playwright browsers: `npx playwright install`
- For Detox iOS: `brew tap wix/brew && brew install applesimutils`
 - For Detox Android: set a matching AVD name if needed, e.g.
   - `DETOX_AVD_NAME=Pixel_7_API_34 npm run integrate:android`
   - Default AVD name: `Pixel_7_API_34` (change via env var)

Artifacts
- JUnit/XML: `artifacts/vitest/results.xml`, `artifacts/playwright/results.xml`
- Detox (failing tests only): logs, screenshots, videos under `artifacts/detox/{ios,android}`

Log noise reduction
- iOS Detox build uses `xcodebuild -quiet` and a generic simulator destination to avoid device lists.
- Detox CLI runs with `-l error` and `NODE_NO_WARNINGS=1` to show only actionable errors.
- Detox artifacts are captured only for failing tests (logs/screenshots/videos).

Known warnings (safe to ignore)
- Hermes bundle compile warnings (variables like `Promise`, `AbortController` etc.): benign during JS precompile.
- ld duplicate `-lc++` and missing `Metal.xctoolchain` Swift path: Xcode toolchain quirks; build still valid.
- Xcode “Run script build phase … will be run during every build”: from RN/Pods scripts. Optional fix in Xcode by either unchecking “Based on dependency analysis” or adding an output file to the script phase.
- Android: Gradle “Deprecated features used” banner: from RN/AGP; harmless for current Gradle version.

Watchman note
If you see a Watchman recrawl warning (safe but noisy), clear and re-add the watch once:

`watchman watch-del "$(pwd)" ; watchman watch-project "$(pwd)"`

## Quick start
- Install: `npm i`
- iOS pods (first time): `cd apps/mobile/ios && pod install && cd -`
- Web: `npm run web` → http://localhost:5173
- iOS: `npm run ios` (starts Metro automatically)
- Android: `npm run android`
- Optional: `npm run dev:mobile` then press `i` or `a` inside Metro

## Release builds
- Web: `npm run build:web`
- Android APK (release):
  - Build: `npm run android:release`
  - Install on emulator/device: `npm run android:install:release`

## What’s shared
`@poc/shared` exposes a tiny domain:
- Types and a sample product catalog
- Pure cart helpers + reducer
- A presenter hook `useCart()` used by both apps

Edit `packages/shared/index.ts` and both apps hot‑reload with consistent totals.

## How it works (in brief)
- Monorepo via npm workspaces (`apps/*`, `packages/*`)
- Metro is configured for symlinks and to use a single React copy
- esbuild dev/build aliases React to a single instance for the web

Result: no “Invalid hook call”, no duplicate React, smooth HMR.

### Android (React Native 0.82) notes
- New Architecture is enabled by default. Android initialization uses:
  - `SoLoader.init(applicationContext, OpenSourceMergedSoMapping)`
  - `DefaultNewArchitectureEntryPoint.load()`
- This registers the merged-So mapping so native symbols (e.g. `react_featureflagsjni`) resolve correctly from the merged `reactnative` library.

## Prerequisites
- Node.js 18+
- iOS: Xcode + CocoaPods
- Android: Android Studio SDK, an emulator (API 34), JDK 17

## Troubleshooting (fast)
- Port 8081 busy: kill and reset Metro
  - `lsof -i :8081 -sTCP:LISTEN -t | xargs kill -9`
  - `npm --workspace @poc/mobile run start -- --reset-cache`
- Blank page / invalid hook call (web): ensure one React copy
  - `npm i` at repo root, then reload
- iOS build errors: run `pod install` again in `apps/mobile/ios`
- Android SDK path: add `apps/mobile/android/local.properties` with `sdk.dir=...`

## Why this repo exists
To demonstrate structure and sharing between Web and React Native with the smallest possible surface area. No routing, storage, GraphQL, or styling libraries.
