import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..') // apps/admin
const workspaceRoot = path.resolve(root, '../..')
const require = createRequire(import.meta.url)
const resolveFrom = (id) => require.resolve(id, { paths: [root] })

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
    react: resolveFrom('react'),
    'react/jsx-runtime': resolveFrom('react/jsx-runtime'),
    'react/jsx-dev-runtime': resolveFrom('react/jsx-dev-runtime'),
    'react-dom': resolveFrom('react-dom'),
    'react-dom/client': resolveFrom('react-dom/client'),
    '@axis/shared': path.join(workspaceRoot, 'packages/shared/index.ts')
  }
})

await ctx.watch()
await ctx.serve({ servedir: root, port: 5273 })
console.log('→ Admin dev server on http://localhost:5273')
