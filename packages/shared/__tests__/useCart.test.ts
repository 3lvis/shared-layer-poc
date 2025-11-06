import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart, catalog } from '..'

describe('useCart presenter hook', () => {
  it('starts empty with zero totals', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.itemCount).toBe(0)
    expect(result.current.totalNOK).toBe(0)
    expect(result.current.items).toEqual([])
  })

  it('adds items and exposes derived values', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.add('apl'))
    act(() => result.current.add('apl'))
    const price = catalog['apl'].priceNOK
    expect(result.current.itemCount).toBe(2)
    expect(result.current.totalNOK).toBe(price * 2)
    expect(result.current.items[0]).toMatchObject({ id: 'apl', qty: 2 })
  })

  it('removes items and can clear', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.add('apl'))
    act(() => result.current.add('apl'))
    act(() => result.current.remove('apl'))
    expect(result.current.itemCount).toBe(1)
    act(() => result.current.clear())
    expect(result.current.itemCount).toBe(0)
    expect(result.current.totalNOK).toBe(0)
  })
})

