# Monorepo: Shared TypeScript Layer for React + React Native (Unit + E2E)

Build a clean, repeatable setup that shares one TypeScript package between a React web app and a React Native app, with unit tests and integration tests. This guide focuses on structure, tooling, and the “why”, not on app‑specific domain code.

Result:
- One shared package consumed by Web and Mobile.
- Vitest for unit tests.
- Playwright for Web E2E, Detox for Mobile E2E.
- Single React copy across the workspace to avoid invalid hook calls.

Replace `@org` with your own scope (or drop the scope entirely) as you copy.


## 1) Prerequisites
- Node.js 18+
- macOS + Xcode + iOS Simulator + CocoaPods
- Android SDK (API 34), an emulator, JDK 17
- Recommended: Watchman, Homebrew

One‑time tools:
- `npx playwright install`
- `brew tap wix/brew && brew install applesimutils`


## 2) Workspace Layout
Create this structure:

```
my-mono/
  apps/
    web/
    mobile/
  packages/
    shared/
  artifacts/
```

At repo root, create `package.json` with npm workspaces and shared scripts. Pin React to one version workspace‑wide:

```json
{
  "name": "my-mono",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "overrides": { "react": "19.1.1", "react-dom": "19.1.1" },
  "scripts": {
    "dev:web": "node apps/web/scripts/dev.mjs",
    "web": "npm run dev:web",
    "build:web": "node apps/web/scripts/build.mjs",
    "dev:mobile": "npm --workspace @org/mobile run start",
    "ios": "npm --workspace @org/mobile run ios",
    "android": "npm --workspace @org/mobile run android",
    "test": "npm --workspace @org/shared run test",
    "integrate:web": "npx playwright test -c apps/web/playwright.config.js",
    "integrate:ios": "npm --workspace @org/mobile run e2e:ios",
    "integrate:android": "npm --workspace @org/mobile run e2e:android",
    "integrate:all": "npm run integrate:web && npm run integrate:ios && npm run integrate:android",
    "fix:watchman": "watchman watch-del \"$PWD\" ; watchman watch-project \"$PWD\""
  },
  "devDependencies": {
    "@playwright/test": "^1.48.2",
    "@testing-library/react": "^16.0.0",
    "detox": "^20.16.2",
    "jest": "^29.7.0",
    "jsdom": "^27.1.0",
    "vitest": "^2.1.1"
  }
}
```

Optional root TS project references:

```json
{
  "files": [],
  "references": [
    { "path": "packages/shared" },
    { "path": "apps/web" },
    { "path": "apps/mobile" }
  ]
}
```

Install once at the root: `npm i`.


## 3) Shared Package
Create `packages/shared/package.json`:

```json
{
  "name": "@org/shared",
  "version": "0.0.0",
  "type": "module",
  "main": "index.ts",
  "types": "index.ts",
  "peerDependencies": { "react": ">=18.2 <20" },
  "scripts": { "test": "vitest run" }
}
```

Create `packages/shared/index.ts` and export anything you plan to reuse (types, pure functions, hooks):

```ts
export function example(): string { return 'shared' }
```

Add `packages/shared/vitest.config.ts` so tests resolve React from the workspace root:

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..', '..')
const aliasToRoot = (p: string) => path.resolve(root, 'node_modules', p)

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['__tests__/**/*.test.ts'],
    reporters: [ 'default', ['junit', { outputFile: '../../artifacts/vitest/results.xml' }] ]
  },
  resolve: {
    alias: {
      react: aliasToRoot('react'),
      'react/jsx-runtime': aliasToRoot('react/jsx-runtime.js'),
      'react/jsx-dev-runtime': aliasToRoot('react/jsx-dev-runtime.js'),
      'react-dom': aliasToRoot('react-dom'),
      'react-dom/client': aliasToRoot('react-dom/client.js')
    }
  }
})
```

Example unit tests:

`packages/shared/__tests__/pure.test.ts`
```ts
import { describe, it, expect } from 'vitest'
import { example } from '..'

describe('shared utils', () => {
  it('example returns shared', () => {
    expect(example()).toBe('shared')
  })
})
```

If you export React hooks from `@org/shared`, add tests using Testing Library’s `renderHook` in the same test folder.


## 4) Web App (esbuild + Playwright)
`apps/web/package.json`:

```json
{
  "name": "@org/web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": { "dev": "node scripts/dev.mjs", "build": "node scripts/build.mjs" },
  "dependencies": { "react-dom": "19.1.1", "@org/shared": "0.0.0" },
  "devDependencies": { "esbuild": "^0.24.0", "typescript": "^5.6.3" }
}
```

`apps/web/scripts/dev.mjs`:

```js
import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const require = createRequire(import.meta.url)
const resolveFromWeb = (id) => require.resolve(id, { paths: [root] })

const ctx = await esbuild.context({
  entryPoints: ['src/main.tsx'],
  outfile: 'dist/app.js',
  absWorkingDir: root,
  bundle: true,
  format: 'esm',
  sourcemap: true,
  target: 'es2022',
  jsx: 'automatic',
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  define: { 'process.env.NODE_ENV': '"development"' },
  alias: {
    react: resolveFromWeb('react'),
    'react/jsx-runtime': resolveFromWeb('react/jsx-runtime'),
    'react/jsx-dev-runtime': resolveFromWeb('react/jsx-dev-runtime'),
    'react-dom': resolveFromWeb('react-dom'),
    'react-dom/client': resolveFromWeb('react-dom/client')
  }
})

await ctx.watch()
await ctx.serve({ servedir: root, port: 5173 })
console.log('http://localhost:5173')
```

`apps/web/scripts/build.mjs`:

```js
import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const require = createRequire(import.meta.url)
const resolveFromWeb = (id) => require.resolve(id, { paths: [root] })

export async function build() {
  return esbuild.build({
    entryPoints: ['src/main.tsx'],
    outfile: 'dist/app.js',
    absWorkingDir: root,
    bundle: true,
    format: 'esm',
    sourcemap: true,
    target: 'es2022',
    jsx: 'automatic',
    loader: { '.ts': 'ts', '.tsx': 'tsx' },
    define: { 'process.env.NODE_ENV': '"production"' },
    alias: {
      react: resolveFromWeb('react'),
      'react/jsx-runtime': resolveFromWeb('react/jsx-runtime'),
      'react/jsx-dev-runtime': resolveFromWeb('react/jsx-dev-runtime'),
      'react-dom': resolveFromWeb('react-dom'),
      'react-dom/client': resolveFromWeb('react-dom/client')
    }
  })
}

if (import.meta.url === `file://${process.argv[1]}`) { await build() }
```

`apps/web/index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Web</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/dist/app.js"></script>
  </body>
  </html>
```

`apps/web/tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "module": "esnext",
    "moduleResolution": "bundler",
    "target": "ES2022"
  },
  "include": ["src"]
}
```

`apps/web/src/main.tsx`:

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import * as Shared from '@org/shared'

function App() {
  return <main data-testid="root-screen">Hello</main>
}

createRoot(document.getElementById('root')!).render(<App />)
```

Playwright setup:

`apps/web/playwright.config.js`:

```js
import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  reporter: [ ['list'], ['junit', { outputFile: '../../artifacts/playwright/results.xml' }] ],
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  webServer: {
    command: 'node scripts/dev.mjs',
    cwd: __dirname,
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60000
  },
  projects: [ { name: 'chromium', use: { ...devices['Desktop Chrome'] } } ]
})
```

`apps/web/e2e/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('loads the app', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('root-screen')).toBeVisible()
})
```

Run: `npm run web` or `npm run integrate:web`.


## 5) React Native App (Metro + Detox)
Initialize the app in `apps/mobile` (let workspaces manage deps):

```
npx @react-native-community/cli init mobile --directory apps/mobile --skip-install
```

`apps/mobile/package.json`:

```json
{
  "name": "@org/mobile",
  "version": "0.0.0",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "react-native start",
    "ios": "react-native run-ios --simulator 'iPhone 16 Pro'",
    "android": "react-native run-android",
    "e2e:ios": "npx detox build -c ios.sim.release -l error && NODE_NO_WARNINGS=1 npx detox test -c ios.sim.release -l error --artifacts-location ../../artifacts/detox/ios --record-logs failing --take-screenshots failing --record-videos failing",
    "e2e:android": "npx detox build -c android.emu.release -l error && NODE_NO_WARNINGS=1 npx detox test -c android.emu.release -l error --artifacts-location ../../artifacts/detox/android --record-logs failing --take-screenshots failing --record-videos failing"
  },
  "dependencies": {
    "@babel/runtime": "^7.25.0",
    "react": "19.1.1",
    "react-native": "0.82.1",
    "@org/shared": "0.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "@react-native/babel-preset": "0.82.1",
    "@babel/core": "^7.20.0",
    "@react-native/metro-config": "0.82.1"
  }
}
```

`apps/mobile/metro.config.js`:

```js
const path = require('node:path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '../..')

module.exports = mergeConfig(getDefaultConfig(projectRoot), {
  resolver: {
    unstable_enableSymlinks: true,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules')
    ],
    disableHierarchicalLookup: true,
    extraNodeModules: {
      react: path.resolve(workspaceRoot, 'node_modules/react'),
      'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
      '@babel/runtime': path.resolve(workspaceRoot, 'node_modules/@babel/runtime')
    },
    blockList: [
      new RegExp(`[\\\\/]packages[\\\\/][^\\\\/]+[\\\\/]node_modules[\\\\/]react([\\\\/].*)?$`),
      new RegExp(`[\\\\/]packages[\\\\/][^\\\\/]+[\\\\/]node_modules[\\\\/]react-native([\\\\/].*)?$`)
    ]
  },
  watchFolders: [ workspaceRoot, path.resolve(workspaceRoot, 'packages/shared') ]
})
```

Minimal `apps/mobile/App.tsx`:

```tsx
import React from 'react'
import { SafeAreaView, Text } from 'react-native'
import * as Shared from '@org/shared'

export default function App() {
  return (
    <SafeAreaView>
      <Text testID="root-screen">Hello</Text>
    </SafeAreaView>
  )
}
```

iOS: `cd apps/mobile/ios && pod install && cd -`

Android SDK path if needed: create `apps/mobile/android/local.properties` with `sdk.dir=/path/to/Android/sdk`.

Detox config:

`apps/mobile/detox.config.js`:

```js
module.exports = {
  testRunner: { args: { $0: 'jest', config: 'e2e/jest.config.js' }, jest: { setupTimeout: 120000 } },
  apps: {
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/mobile.app',
      build: "xcodebuild -quiet -workspace ios/mobile.xcworkspace -scheme mobile -configuration Release -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' -derivedDataPath ios/build"
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest && cd -',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk'
    }
  },
  devices: {
    simulator: { type: 'ios.simulator', device: { type: 'iPhone 16' } },
    emulator: { type: 'android.emulator', device: { avdName: process.env.DETOX_AVD_NAME || 'Pixel_7_API_34' } }
  },
  configurations: {
    'ios.sim.release': { device: 'simulator', app: 'ios.release' },
    'android.emu.release': { device: 'emulator', app: 'android.release' }
  }
}
```

`apps/mobile/e2e/jest.config.js`:

```js
module.exports = {
  testRunner: 'jest-circus/runner',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testMatch: ['**/*.e2e.{js,ts}'],
  testTimeout: 300000
}
```

`apps/mobile/e2e/smoke.e2e.js`:

```js
describe('App', () => {
  beforeAll(async () => { await device.launchApp({ delete: true, newInstance: true }) })
  it('shows the home screen', async () => {
    await waitFor(element(by.id('root-screen'))).toBeVisible().withTimeout(30000)
  })
})
```

Android Detox wiring:
- In `apps/mobile/android/build.gradle` ensure Detox local Maven repo is available:

```gradle
allprojects {
  repositories {
    google()
    mavenCentral()
    maven { url = uri("$rootDir/../../../node_modules/detox/Detox-android") }
  }
}
```

- In `apps/mobile/android/app/build.gradle` add instrumentation dependencies:

```gradle
dependencies {
  androidTestImplementation("com.wix:detox:+")
  androidTestImplementation("androidx.test:runner:1.5.2")
  androidTestImplementation("androidx.test:rules:1.5.0")
}
```

Run: `npm run ios`, `npm run android`, `npm run integrate:ios`, `npm run integrate:android`.


## 6) Running Everything
- Unit tests: `npm test`
- Web dev: `npm run web` → open http://localhost:5173
- Web E2E: `npm run integrate:web`
- Mobile dev: `npm run ios` or `npm run android`
- Mobile E2E: `npm run integrate:ios` or `npm run integrate:android`

Artifacts are written under `artifacts/` (JUnit XML, Detox logs/screenshots/videos for failures).


## 7) Core Principles (what makes this work)
- Single React copy. Pin React/React‑DOM in the root and make every tool resolve React from the workspace root (esbuild alias, Vitest alias, Metro extraNodeModules). This removes invalid‑hook‑call errors and duplicate React installs.
- Shared code stays framework‑agnostic. Put domain logic and lightweight presenter hooks in `@org/shared`; avoid bundler/Node APIs there.
- Keep E2E thin. Tests target visible behavior via testIDs/selectors, not implementation details.


## 8) Troubleshooting
- Metro port busy (8081):
  - `lsof -i :8081 -sTCP:LISTEN -t | xargs kill -9`
  - `npm --workspace @org/mobile run start -- --reset-cache`
- Watchman recrawl noise: `npm run fix:watchman`
- iOS pods: rerun `pod install` in `apps/mobile/ios` after dependency changes
- Android SDK: ensure `local.properties` has a valid `sdk.dir`


## 9) Next Steps
- Add more packages under `packages/` (e.g., design‑system, API client) and reuse the same resolution pattern.
- Wire CI to run `npm test`, `npm run integrate:web`, and at least one mobile E2E target.
- Consider Vite instead of esbuild for web if you want a richer dev server; the React resolution principle remains the same.
