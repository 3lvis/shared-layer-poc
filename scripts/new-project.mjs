#!/usr/bin/env node
// Minimal init script to customize this template for a new project
// Usage: node scripts/new-project.mjs --scope my-scope --title "My App" --repo my-repo-name

import fs from 'node:fs/promises'
import path from 'node:path'

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
const scope = (args.scope || 'axis').replace(/^@/, '')
const title = args.title || 'Axis'
const repoName = args.repo || null

const root = process.cwd()

function r(...p) { return path.join(root, ...p) }

async function read(p) { return fs.readFile(p, 'utf8') }
async function write(p, s) { await fs.writeFile(p, s) }

function replaceAll(s, map) {
  let out = s
  for (const [from, to] of map) {
    out = out.split(from).join(to)
  }
  return out
}

async function updateJSON(file, mutator) {
  const text = await read(file)
  const json = JSON.parse(text)
  const next = await mutator(json)
  await write(file, JSON.stringify(next, null, 2) + '\n')
}

// 1) package.json files
await updateJSON(r('apps/web/package.json'), j => {
  j.name = `@${scope}/web`
  if (j.dependencies && j.dependencies['@axis/shared']) {
    j.dependencies[`@${scope}/shared`] = j.dependencies['@axis/shared']
    delete j.dependencies['@axis/shared']
  }
  return j
})

await updateJSON(r('apps/mobile/package.json'), j => {
  j.name = `@${scope}/mobile`
  if (j.dependencies && j.dependencies['@axis/shared']) {
    j.dependencies[`@${scope}/shared`] = j.dependencies['@axis/shared']
    delete j.dependencies['@axis/shared']
  }
  return j
})

// Admin app (if present)
try {
  await updateJSON(r('apps/admin/package.json'), j => {
    j.name = `@${scope}/admin`
    if (j.dependencies && j.dependencies['@axis/shared']) {
      j.dependencies[`@${scope}/shared`] = j.dependencies['@axis/shared']
      delete j.dependencies['@axis/shared']
    }
    return j
  })
} catch {}

await updateJSON(r('packages/shared/package.json'), j => {
  j.name = `@${scope}/shared`
  return j
})

// API package name + deps (if present)
try {
  await updateJSON(r('services/api/package.json'), j => {
    j.name = `@${scope}/api`
    if (j.dependencies && j.dependencies['@axis/shared']) {
      j.dependencies[`@${scope}/shared`] = j.dependencies['@axis/shared']
      delete j.dependencies['@axis/shared']
    }
    return j
  })
} catch {}

// 2) Code imports + UI headings
const mobileAppPath = r('apps/mobile/App.tsx')
await write(
  mobileAppPath,
  replaceAll(await read(mobileAppPath), [
    ['@axis/shared', `@${scope}/shared`],
    ['Axis Mobile', `${title} Mobile`]
  ])
)

const webMainPath = r('apps/web/src/main.tsx')
await write(
  webMainPath,
  replaceAll(await read(webMainPath), [
    ['@axis/shared', `@${scope}/shared`],
    ['Axis Web', `${title} Web`]
  ])
)

// API imports (if present)
try {
  const apiIndexPath = r('services/api/src/index.ts')
  await write(
    apiIndexPath,
    replaceAll(await read(apiIndexPath), [
      ['@axis/shared', `@${scope}/shared`]
    ])
  )
} catch {}

// Admin UI heading + imports (if present)
try {
  const adminMainPath = r('apps/admin/src/main.tsx')
  await write(
    adminMainPath,
    replaceAll(await read(adminMainPath), [
      ['@axis/shared', `@${scope}/shared`],
      ['Axis Admin', `${title} Admin`]
    ])
  )
} catch {}

// 3) README + root name
const readmePath = r('README.md')
await write(
  readmePath,
  replaceAll(await read(readmePath), [
    ['@axis/shared', `@${scope}/shared`],
    ['@axis/mobile', `@${scope}/mobile`],
    ['@axis/admin', `@${scope}/admin`],
    ['Axis Web', `${title} Web`],
    ['Axis Mobile', `${title} Mobile`],
    ['Axis Admin', `${title} Admin`],
    ['axis-apps', repoName || 'axis-apps']
  ])
)

if (repoName) {
  await updateJSON(r('package.json'), j => {
    j.name = repoName
    return j
  })
}

console.log(`✔ Updated template for scope @${scope}${repoName ? `, repo ${repoName}` : ''}, title "${title}"`)
