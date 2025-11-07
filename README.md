# shared-layer-poc

Share one TypeScript “domain” between a React web app and a React Native app. Tiny, practical, and fast to skim. This is a reference, not a framework.

## Quick start
- Install: `npm i`
- iOS pods (first time): `cd apps/mobile/ios && pod install && cd -`
- Web: `npm run web` → http://localhost:5173
- iOS: `npm run ios` (starts Metro automatically)
- Android: `npm run android`
- Optional: `npm run dev:mobile` then press `i` or `a` inside Metro

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
