import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..') // apps/admin
const require = createRequire(import.meta.url)
const resolveFrom = (id) => require.resolve(id, { paths: [root] })

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
      react: resolveFrom('react'),
      'react/jsx-runtime': resolveFrom('react/jsx-runtime'),
      'react/jsx-dev-runtime': resolveFrom('react/jsx-dev-runtime'),
      'react-dom': resolveFrom('react-dom'),
      'react-dom/client': resolveFrom('react-dom/client')
    }
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await build()
}

