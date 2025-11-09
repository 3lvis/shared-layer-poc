import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..') // apps/web
const workspaceRoot = path.resolve(root, '../..')
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
    'react-dom/client': resolveFromWeb('react-dom/client'),
    '@axis/shared': path.join(workspaceRoot, 'packages/shared/index.ts')
  }
})

await ctx.watch()
await ctx.serve({ servedir: root, port: 5173 })
console.log('→ Web dev server on http://localhost:5173')
