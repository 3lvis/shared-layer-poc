#!/usr/bin/env node
// Axis CLI: convenience wrapper around repo tasks for template consumers.
// Commands:
//   axis create --dir ../new-repo --scope foo --title "Foo" --repo foo-axis-apps [--origin ...] [--upstream ...]
//   axis update                           (fetch+merge upstream/main)
//   axis doctor                           (basic environment + repo checks)

import { spawn } from 'node:child_process'
import path from 'node:path'

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

async function main() {
  const args = parse(process.argv)
  const cmd = args._[0] || 'help'
  const repoRoot = process.cwd()

  switch (cmd) {
    case 'create': {
      const script = path.join(repoRoot, 'scripts', 'scaffold.mjs')
      const passthrough = process.argv.slice(process.argv.indexOf('create') + 1)
      await run(process.execPath, [script, ...passthrough])
      break
    }
    case 'update': {
      // Pull from upstream/main by default
      const upstream = args.upstream || 'upstream'
      const branch = args.branch || 'main'
      await run('git', ['fetch', upstream])
      await run('git', ['merge', `${upstream}/${branch}`])
      break
    }
    case 'doctor': {
      console.log('Axis doctor')
      await run('node', ['-v'])
      await run('npm', ['-v'])
      // Workspaces visible?
      await run('npm', ['pkg', 'get', 'workspaces'])
      console.log('OK: basic checks complete')
      break
    }
    default: {
      console.log(`Axis CLI
Usage:
  axis create --dir ../new-repo --scope my-scope --title "My App" --repo my-repo [--origin git-url] [--upstream git-url]
  axis update [--upstream remote] [--branch main]
  axis doctor
`)
    }
  }
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})

