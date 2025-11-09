import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '..'

describe('useCounter', () => {
  it('increments, decrements and resets', () => {
    const { result } = renderHook(() => useCounter(1))
    expect(result.current.count).toBe(1)
    act(() => result.current.inc())
    expect(result.current.count).toBe(2)
    act(() => result.current.dec())
    expect(result.current.count).toBe(1)
    act(() => result.current.reset())
    expect(result.current.count).toBe(1)
  })
})

