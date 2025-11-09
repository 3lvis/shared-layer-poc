#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

export function parse(argv) {
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

export function run(cmd, args, opts = {}) {
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

function truthy(v) {
  if (v === undefined || v === null) return false
  if (typeof v === 'boolean') return v
  const s = String(v).toLowerCase()
  return s === '1' || s === 'true' || s === 'yes' || s === 'y'
}

export async function createCmd(args, exec = run) {
  const dest = path.resolve(process.cwd(), args.dir || './new-axis-apps')
  const scope = (args.scope || 'axis').replace(/^@/, '')
  const title = args.title || 'Axis'
  const repo = args.repo || null
  const origin = args.origin || null
  const upstream = args.upstream || null
  // Resolve default template to repo root when running from source
  const template = args.template || process.env.AXIS_TEMPLATE || path.resolve(new URL('.', import.meta.url).pathname, '../../..')
  const skipGit = truthy(args.noGit)
  const quiet = truthy(args.quiet)

  if (!quiet) {
    console.log('Axis create')
    console.log(`• Template: ${template}`)
    console.log(`• Destination: ${dest}`)
  }

  await ensureDir(path.dirname(dest))

  if (/^(https?:|git@|ssh:|github:)/.test(template)) {
    if (!quiet) console.log('• Cloning template')
    await exec('git', ['clone', '--depth', '1', template, dest])
  } else {
    if (!quiet) console.log('• Copying template directory')
    const ignore = new Set(['.git', 'node_modules', 'Pods', 'build', '.gradle', '.idea', 'DerivedData', 'artifacts'])
    await copyRecursive(template, dest, ignore)
  }

  // Clear template git history to start fresh
  await removeIfExists(path.join(dest, '.git'))

  // Apply project customizations
  if (!quiet) console.log('• Applying project customizations')
  const initScript = path.join(dest, 'scripts', 'new-project.mjs')
  if (await pathExists(initScript)) {
    await exec(process.execPath, [initScript, '--scope', scope, '--title', title, ...(repo ? ['--repo', repo] : [])])
  } else if (!quiet) {
    console.warn('! Skipping project init step (scripts/new-project.mjs not found in template)')
  }

  // Initialize git and configure remotes
  if (!skipGit) {
    if (!quiet) console.log('• Initializing git repository')
    await exec('git', ['init'], { cwd: dest })
    await exec('git', ['add', '.'], { cwd: dest })
    await exec('git', ['commit', '-m', 'chore: scaffold from axis template'], { cwd: dest })
    if (origin && origin !== 'true') {
      await exec('git', ['remote', 'add', 'origin', origin], { cwd: dest })
    }
    if (upstream && upstream !== 'true') {
      await exec('git', ['remote', 'add', 'upstream', upstream], { cwd: dest })
    }
  }

  if (!quiet) console.log(`✔ Created project at ${dest}`)
  return dest
}

export async function updateCmd(args, exec = run) {
  const upstream = args.upstream || 'upstream'
  const branch = args.branch || 'main'
  console.log(`Axis update: merging ${upstream}/${branch}`)
  await exec('git', ['fetch', upstream])
  await exec('git', ['merge', `${upstream}/${branch}`])
}

export async function doctorCmd(exec = run) {
  console.log('Axis doctor')
  await exec('node', ['-v'])
  await exec('npm', ['-v'])
  console.log('OK: basic checks complete')
}

export async function testCmd(args, exec = run) {
  console.log('Axis test')
  // Smoke test: create a project from local template into artifacts/cli-test
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const base = path.resolve(process.cwd(), 'artifacts/cli-test')
  const dir = path.join(base, `axis-${stamp}`)
  await ensureDir(base)
  const created = await createCmd({ ...args, dir, noGit: 'true', quiet: 'true' }, exec)
  // Verify expected files exist
  const expected = ['package.json', 'README.md', 'scripts/new-project.mjs']
  for (const f of expected) {
    const p = path.join(created, f)
    if (!(await pathExists(p))) {
      throw new Error(`Smoke test failed: missing ${f}`)
    }
  }
  console.log(`✔ CLI smoke test passed (${created})`)
}

function isAxisWorkspace(root) {
  const mustHave = [
    'package.json',
    'apps/web',
    'packages/shared',
    'services/api'
  ]
  return Promise.all(mustHave.map(p => pathExists(path.join(root, p)))).then(all => all.every(Boolean))
}

async function readJSON(p) {
  const s = await fs.readFile(p, 'utf8')
  return JSON.parse(s)
}

async function hasScript(root, name) {
  try {
    const pkg = await readJSON(path.join(root, 'package.json'))
    return Boolean(pkg.scripts && pkg.scripts[name])
  } catch { return false }
}

export async function integrateCmd(args, exec = run) {
  console.log('Axis integrate')
  const root = process.cwd()
  const local = truthy(args.local)
  const withMobile = truthy(args.withMobile)
  const skipWeb = truthy(args.skipWeb)
  const withTypecheck = truthy(args.typecheck)
  const looksLikeAxis = await isAxisWorkspace(root)

  if (local || looksLikeAxis) {
    // Orchestrate local demo verification
    // Optional typecheck (can be noisy without react types in dev env)
    if (withTypecheck && await hasScript(root, 'typecheck')) {
      await exec('npm', ['run', '-s', 'typecheck'], { cwd: root })
    }
    // Shared unit tests
    await exec('npm', ['--workspace', '@axis/shared', 'run', '-s', 'test'], { cwd: root })
    // Web integration (Playwright)
    if (!skipWeb) {
      try {
        await exec('npm', ['run', '-s', 'integrate:web'], { cwd: root })
      } catch (e) {
        console.warn('! Web integration failed. If running in a restricted environment, retry with --skipWeb')
        throw e
      }
    } else {
      console.log('• Skipping web integration (--skipWeb)')
    }
    // Optional mobile integrations
    if (withMobile) {
      await exec('npm', ['run', '-s', 'integrate:ios'], { cwd: root })
      await exec('npm', ['run', '-s', 'integrate:android'], { cwd: root })
    }
    console.log('✔ Local integration passed')
    return
  }

  // Fallback: internal CLI smoke create
  await testCmd(args, exec)
}

async function main() {
  const a = parse(process.argv)
  const cmd = a._[0] || 'help'
  if (cmd === 'create') return createCmd(a)
  if (cmd === 'update') return updateCmd(a)
  if (cmd === 'integrate') return integrateCmd(a)
  if (cmd === 'test') return testCmd(a)
  if (cmd === 'doctor') return doctorCmd()
  console.log(`Axis CLI
Usage:
  axis create --dir ../new-repo --scope my-scope --title "My App" --repo my-repo [--template <git-url|path>] [--origin git-url] [--upstream git-url] [--noGit]
  axis update [--upstream remote] [--branch main]
  axis integrate [--local] [--withMobile] [--typecheck] [--skipWeb]  # verify local demo workspace
  axis test       # internal smoke test for CLI
  axis doctor
`)
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
