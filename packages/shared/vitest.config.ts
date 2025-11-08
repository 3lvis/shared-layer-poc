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
    reporters: [
      'default',
      ['junit', { outputFile: '../../artifacts/vitest/results.xml' }]
    ]
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
