import { describe, it, expect, vi } from 'vitest'
import path from 'node:path'
import fs from 'node:fs/promises'
import { createCmd, updateCmd, doctorCmd, testCmd, integrateCmd } from '../src/index.mjs'

function makeRunner(calls) {
  return async (cmd, args, opts = {}) => {
    calls.push({ cmd, args, opts })
  }
}

async function makeTemplate() {
  const base = path.resolve(process.cwd(), 'artifacts/cli-test-template')
  await fs.rm(base, { recursive: true, force: true })
  await fs.mkdir(path.join(base, 'scripts'), { recursive: true })
  await fs.writeFile(path.join(base, 'package.json'), JSON.stringify({ name: 'axis-template' }, null, 2))
  await fs.writeFile(path.join(base, 'README.md'), '# Template')
  await fs.writeFile(path.join(base, 'scripts', 'new-project.mjs'), '#!/usr/bin/env node\nconsole.log("noop new-project");\n')
  return base
}

describe('commands', () => {
  it('update calls git fetch + merge', async () => {
    const calls = []
    const r = makeRunner(calls)
    await updateCmd({ upstream: 'ups', branch: 'dev' }, r)
    expect(calls[0]).toMatchObject({ cmd: 'git', args: ['fetch', 'ups'] })
    expect(calls[1]).toMatchObject({ cmd: 'git', args: ['merge', 'dev' ? 'ups/dev' : ''] })
  })

  it('doctor checks node and npm versions', async () => {
    const calls = []
    const r = makeRunner(calls)
    await doctorCmd(r)
    expect(calls[0].cmd).toBe('node')
    expect(calls[1].cmd).toBe('npm')
  })

  it('create skips git when noGit set and returns dest', async () => {
    const calls = []
    const r = makeRunner(calls)
    const template = await makeTemplate()
    const dest = path.resolve(process.cwd(), 'artifacts/cli-test-create')
    await fs.rm(dest, { recursive: true, force: true })
    const out = await createCmd({ template, dir: dest, noGit: 'true', quiet: 'true' }, r)
    expect(out).toBe(dest)
    const pkg = await fs.readFile(path.join(dest, 'package.json'), 'utf8')
    expect(JSON.parse(pkg).name).toBe('axis-template')
    // ensure git commands were not invoked
    expect(calls.find(c => c.cmd === 'git')).toBeUndefined()
  })

  it('test/integrate run smoke create', async () => {
    const calls = []
    const r = makeRunner(calls)
    const template = await makeTemplate()
    await testCmd({ template }, r)
    await integrateCmd({ template }, r)
    // expect that new-project was invoked in one of the runs
    const invoked = calls.some(c => String(c.args?.[0] || '').endsWith('new-project.mjs'))
    expect(invoked).toBe(true)
  })
})

