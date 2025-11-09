import { describe, it, expect } from 'vitest'
import { parse } from '../src/index.mjs'

describe('parse', () => {
  it('parses positional and flags', () => {
    const a = parse(['node', 'axis', 'create', '--dir', '../x', '--flag', '--title', 'Hello'])
    expect(a._[0]).toBe('create')
    expect(a.dir).toBe('../x')
    expect(a.flag).toBe('true')
    expect(a.title).toBe('Hello')
  })
})

