// Minimal shared utilities (no domain-specific logic)
import { useReducer, useCallback } from 'react'

export function appInfo() {
  return { name: 'Axis', tagline: 'One monorepo, many surfaces' }
}

export function useCounter(initial = 0) {
  type Action = { type: 'inc' | 'dec' | 'reset' }
  function reducer(state: number, action: Action): number {
    switch (action.type) {
      case 'inc':
        return state + 1
      case 'dec':
        return state - 1
      case 'reset':
        return initial
      default:
        return state
    }
  }
  const [count, dispatch] = useReducer(reducer, initial)
  const inc = useCallback(() => dispatch({ type: 'inc' }), [])
  const dec = useCallback(() => dispatch({ type: 'dec' }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [initial])
  return { count, inc, dec, reset }
}
