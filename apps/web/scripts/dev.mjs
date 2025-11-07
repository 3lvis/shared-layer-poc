import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..') // apps/web

const require = createRequire(import.meta.url)

const aliasReactPlugin = {
  name: 'alias-react-singleton',
  setup(build) {
    const resolveFromWeb = (id) => require.resolve(id, { paths: [root] })
    build.onResolve({ filter: /^react$/ }, () => ({ path: resolveFromWeb('react') }))
    build.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ path: resolveFromWeb('react/jsx-runtime') }))
    build.onResolve({ filter: /^react\/jsx-dev-runtime$/ }, () => ({ path: resolveFromWeb('react/jsx-dev-runtime') }))
    build.onResolve({ filter: /^react-dom$/ }, () => ({ path: resolveFromWeb('react-dom') }))
    build.onResolve({ filter: /^react-dom\/client$/ }, () => ({ path: resolveFromWeb('react-dom/client') }))
  }
}

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
