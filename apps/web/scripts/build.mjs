import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..') // apps/web

export async function build({ watch = false } = {}) {
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
    define: { 'process.env.NODE_ENV': '"development"' },
    watch
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await build()
}
