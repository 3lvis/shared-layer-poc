# shared-layer-poc

Share one TypeScript “domain” between a React web app and a React Native app. Tiny, practical, and fast to skim. This is a reference, not a framework.

## Quick start (Bun default)
- Install Bun: https://bun.sh/docs/installation
- Install deps: `bun install`
- iOS pods (first time): `cd apps/mobile/ios && pod install && cd -`
- Web: `bun run web` → http://localhost:5173
- iOS: `bun run ios` (starts Metro automatically)
- Android: `bun run android`
- Optional: `bun run dev:mobile` then press `i` or `a` inside Metro

### Notes
- Bun drastically speeds up installs (`bun install`) and script startup.
- React Native CLI runs via `bun x react-native` in the mobile workspace.
- Metro/Gradle/Xcode still do the heavy lifting; Bun optimizes the JS shell.

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
  - `bun --cwd apps/mobile x react-native start --reset-cache`
- Blank page / invalid hook call (web): ensure one React copy
  - `npm i` at repo root, then reload
- iOS build errors: run `pod install` again in `apps/mobile/ios`
- Android SDK path: add `apps/mobile/android/local.properties` with `sdk.dir=...`

## Why this repo exists
To demonstrate structure and sharing between Web and React Native with the smallest possible surface area. No routing, storage, GraphQL, or styling libraries.
