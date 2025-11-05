# shared-layer-poc

Minimal monorepo proving that a web React app and a React Native app import the same TypeScript domain code and behave identically. No routing, no storage, no GraphQL, no styling libs.

## What’s inside
- npm workspaces: `apps/*`, `packages/*`
- Shared TypeScript package: `packages/shared`
- Web: React 18 + esbuild (tiny dev/build scripts)
- Mobile: React Native 0.74 (CLI + Metro, no Expo)
- Metro is workspace/symlink friendly using `@react-native/metro-config` + `unstable_enableSymlinks`

## Prerequisites
- Node.js 18+ and npm
- iOS: Xcode + iOS Simulator, CocoaPods (`brew install cocoapods`), then `pod install` once in `apps/mobile/ios`
- Android (optional for this POC): Android Studio, SDKs, emulator

## Install
```bash
npm i

# iOS pods (first time only)
cd apps/mobile/ios && pod install && cd ../..
```

## Run
```bash
# Web (http://localhost:5173)
npm run dev:web

# Mobile — iOS simulator (launches the app; Metro is started automatically if needed)
npm run ios

# Mobile — start Metro only (then press `i` to launch iOS)
npm run dev:mobile

# Android emulator (with an emulator running)
npm run android
```

If the iOS simulator name differs on your machine, list available devices:
```bash
xcrun simctl list devices
```
Then edit `apps/mobile/package.json` script arguments (default: `iPhone 16 Pro`).

## Demo steps
1. In Web, click “Add” for a few items; note the total.
2. In Mobile, tap “Add” for the same items; totals should match.
3. Edit `packages/shared/index.ts` (e.g., change a price); both apps hot‑reload and totals remain consistent.

## Project layout
```
shared-layer-poc/
  package.json
  tsconfig.json
  README.md
  .gitignore
  apps/
    web/
      package.json
      tsconfig.json
      index.html
      src/main.tsx
      scripts/dev.mjs
      scripts/build.mjs
    mobile/
      package.json
      tsconfig.json
      App.tsx
      index.js
      metro.config.js
      react-native.config.js
      android/
      ios/
  packages/
    shared/
      package.json
      tsconfig.json
      index.ts
```

## Notes & decisions
- Web build uses esbuild’s `context.serve` API (0.24+), no Vite.
- Mobile uses React Native CLI + Metro (no Expo). Runs on iOS Simulator by default.
- Shared package is TypeScript-only (`@poc/shared`), consumed by both apps.
- Metro config extends `@react-native/metro-config`, enables symlinks, and watches the workspace so imports resolve from the hoisted `node_modules`.
- React versions: RN 0.74 peers on React 18.2, so mobile uses 18.2. Web can use 18.3.x; this does not affect the shared TS domain code.

## Troubleshooting
- Port 8081 in use:
  - Kill existing Metro: `lsof -i :8081 -sTCP:LISTEN -t | xargs kill -9`
  - Start fresh with cache reset: `npm --workspace @poc/mobile run start -- --reset-cache`
- iOS pods missing / xcconfig errors:
  - `cd apps/mobile/ios && pod install && cd ../..`
- “Cannot find module @react-native/metro-config”:
  - Run `npm i` at repo root to install workspace devDependencies.
- “Unable to resolve module @babel/runtime ...”:
  - Run `npm i` at repo root, then restart Metro with `--reset-cache`.
- Simulator name mismatch:
  - List available devices with `xcrun simctl list devices` and update the `ios` script in `apps/mobile/package.json`.

## Type checking
`npm run typecheck` triggers TS project references from the root. For strict build-mode across packages, we can add `"composite": true` to each referenced tsconfig — say the word and I’ll enable it.

## Acceptance criteria
- Both apps compile and run.
- Both import `@poc/shared`.
- Totals are identical after the same interactions.
- Editing `packages/shared/index.ts` hot‑reloads both with matching totals.
- No network, no GraphQL, no storage, no navigation.
