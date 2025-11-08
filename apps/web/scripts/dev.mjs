import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { aliasReactSingletonPlugin } from './aliasReactPlugin.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..') // apps/web

const aliasReactPlugin = aliasReactSingletonPlugin(root)

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
  plugins: [aliasReactPlugin]
})

await ctx.watch()
await ctx.serve({ servedir: root, port: 5173 })
console.log('→ Web dev server on http://localhost:5173')
