#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

function parse(argv) {
  const out = { _: [] }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const k = a.slice(2)
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true'
      out[k] = v
    } else {
      out._.push(a)
    }
  }
  return out
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts })
    p.on('exit', code => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`)))
  })
}

async function pathExists(p) {
  try { await fs.access(p); return true } catch { return false }
}

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }) }

async function copyRecursive(from, to, ignore = new Set()) {
  const stat = await fs.stat(from)
  if (stat.isDirectory()) {
    const base = path.basename(from)
    if (ignore.has(base)) return
    await ensureDir(to)
    const entries = await fs.readdir(from)
    for (const e of entries) {
      await copyRecursive(path.join(from, e), path.join(to, e), ignore)
    }
  } else if (stat.isFile()) {
    await fs.copyFile(from, to)
  }
}

async function removeIfExists(p) { if (await pathExists(p)) await fs.rm(p, { recursive: true, force: true }) }

async function createCmd(args) {
  const dest = path.resolve(process.cwd(), args.dir || './new-axis-apps')
  const scope = (args.scope || 'axis').replace(/^@/, '')
  const title = args.title || 'Axis'
  const repo = args.repo || null
  const origin = args.origin || null
  const upstream = args.upstream || null
  const template = args.template || process.env.AXIS_TEMPLATE || path.resolve(new URL('.', import.meta.url).pathname, '../../../..')

  console.log('Axis create')
  console.log(`• Template: ${template}`)
  console.log(`• Destination: ${dest}`)

  await ensureDir(path.dirname(dest))

  if (/^(https?:|git@|ssh:|github:)/.test(template)) {
    console.log('• Cloning template')
    await run('git', ['clone', '--depth', '1', template, dest])
  } else {
    console.log('• Copying template directory')
    const ignore = new Set(['.git', 'node_modules', 'Pods', 'build', '.gradle', '.idea', 'DerivedData', 'artifacts'])
    await copyRecursive(template, dest, ignore)
  }

  // Clear template git history to start fresh
  await removeIfExists(path.join(dest, '.git'))

  // Apply project customizations
  console.log('• Applying project customizations')
  await run(process.execPath, [path.join(dest, 'scripts', 'new-project.mjs'), '--scope', scope, '--title', title, ...(repo ? ['--repo', repo] : [])])

  // Initialize git and configure remotes
  console.log('• Initializing git repository')
  await run('git', ['init'], { cwd: dest })
  await run('git', ['add', '.'], { cwd: dest })
  await run('git', ['commit', '-m', 'chore: scaffold from axis template'], { cwd: dest })
  if (origin && origin !== 'true') {
    await run('git', ['remote', 'add', 'origin', origin], { cwd: dest })
  }
  if (upstream && upstream !== 'true') {
    await run('git', ['remote', 'add', 'upstream', upstream], { cwd: dest })
  }

  console.log(`✔ Created project at ${dest}`)
}

async function updateCmd(args) {
  const upstream = args.upstream || 'upstream'
  const branch = args.branch || 'main'
  console.log(`Axis update: merging ${upstream}/${branch}`)
  await run('git', ['fetch', upstream])
  await run('git', ['merge', `${upstream}/${branch}`])
}

async function doctorCmd() {
  console.log('Axis doctor')
  await run('node', ['-v'])
  await run('npm', ['-v'])
  console.log('OK: basic checks complete')
}

async function main() {
  const a = parse(process.argv)
  const cmd = a._[0] || 'help'
  if (cmd === 'create') return createCmd(a)
  if (cmd === 'update') return updateCmd(a)
  if (cmd === 'doctor') return doctorCmd()
  console.log(`Axis CLI
Usage:
  axis create --dir ../new-repo --scope my-scope --title "My App" --repo my-repo [--template <git-url|path>] [--origin git-url] [--upstream git-url]
  axis update [--upstream remote] [--branch main]
  axis doctor
`)
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})

