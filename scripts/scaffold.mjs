#!/usr/bin/env node
// Scaffold a new project from this template into a sibling directory.
// Example:
//   node scripts/scaffold.mjs --dir ../groceries-axis-apps \
//     --scope groceries-axis --title "Groceries" --repo groceries-axis-apps \
//     --origin git@github.com:you/groceries-axis-apps.git \
//     --upstream git@github.com:you/axis-apps.git

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

function parseArgs(argv) {
  const out = {}
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true'
      out[key] = val
    }
  }
  return out
}

const args = parseArgs(process.argv)
const targetDir = args.dir || '../new-axis-apps'
const scope = (args.scope || 'axis').replace(/^@/, '')
const title = args.title || 'Axis'
const repo = args.repo || null
const origin = args.origin || null
const upstream = args.upstream || null

const root = process.cwd()
const src = root
const dest = path.resolve(root, targetDir)

const IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  // Big native/build folders to speed up copy
  'Pods',
  'build',
  '.gradle',
  '.idea',
  'DerivedData',
  'artifacts'
])

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function copyRecursive(from, to) {
  const stat = await fs.stat(from)
  if (stat.isDirectory()) {
    const base = path.basename(from)
    if (IGNORE_DIRS.has(base)) return
    await ensureDir(to)
    const entries = await fs.readdir(from)
    for (const e of entries) {
      await copyRecursive(path.join(from, e), path.join(to, e))
    }
  } else if (stat.isFile()) {
    await fs.copyFile(from, to)
  }
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts })
    p.on('exit', code => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`)))
  })
}

console.log(`• Copying template to ${dest}`)
await ensureDir(dest)
await copyRecursive(src, dest)

console.log('• Applying project customizations')
await run(process.execPath, [path.join(dest, 'scripts', 'new-project.mjs'), '--scope', scope, '--title', title, ...(repo ? ['--repo', repo] : [])])

// Optional: initialize git and set remotes
try {
  console.log('• Initializing git repository')
  await run('git', ['init'], { cwd: dest })
  await run('git', ['add', '.'], { cwd: dest })
  await run('git', ['commit', '-m', 'chore: scaffold from axis-apps template'], { cwd: dest })
  if (origin && origin !== 'true') {
    console.log(`• Setting origin -> ${origin}`)
    await run('git', ['remote', 'add', 'origin', origin], { cwd: dest })
  }
  if (upstream && upstream !== 'true') {
    console.log(`• Setting upstream -> ${upstream}`)
    await run('git', ['remote', 'add', 'upstream', upstream], { cwd: dest })
  }
} catch (e) {
  console.warn('! Git initialization step skipped or failed:', e.message)
}

console.log(`✔ Scaffolded at ${dest}`)

