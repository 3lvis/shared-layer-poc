import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { aliasReactSingletonPlugin } from './aliasReactPlugin.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..') // apps/web
const aliasReactPlugin = aliasReactSingletonPlugin(root)

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
    plugins: [aliasReactPlugin]
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await build()
}
