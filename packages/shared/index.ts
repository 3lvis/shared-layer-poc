export type Product = { id: string; name: string; priceNOK: number }
export type CartLine = { productId: string; qty: number }

export const catalog: Record<string, Product> = {
  apl: { id: 'apl', name: 'Pink Lady Apple', priceNOK: 6 },
  mlk: { id: 'mlk', name: 'Whole Milk 1L',   priceNOK: 22 },
  brd: { id: 'brd', name: 'Rugbrød',         priceNOK: 39 }
}

export function addToCart(cart: CartLine[], productId: string): CartLine[] {
  const i = cart.findIndex(l => l.productId === productId)
  if (i === -1) return [...cart, { productId, qty: 1 }]
  const next = cart.slice()
  next[i] = { ...next[i], qty: next[i].qty + 1 }
  return next
}

export function calcTotal(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + catalog[l.productId].priceNOK * l.qty, 0)
}

// Reducer + presenter hook for shared view logic
export type CartAction =
  | { type: 'add'; productId: string }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }

export function removeFromCart(cart: CartLine[], productId: string): CartLine[] {
  const i = cart.findIndex(l => l.productId === productId)
  if (i === -1) return cart
  const line = cart[i]
  if (line.qty <= 1) return cart.filter((_, idx) => idx !== i)
  const next = cart.slice()
  next[i] = { ...line, qty: line.qty - 1 }
  return next
}

export function clearCart(): CartLine[] { return [] }

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add':
      return addToCart(state, action.productId)
    case 'remove':
      return removeFromCart(state, action.productId)
    case 'clear':
      return clearCart()
    default:
      return state
  }
}

export type CartItemView = {
  id: string
  name: string
  priceNOK: number
  qty: number
  lineTotalNOK: number
}

export function mapCartItems(cart: CartLine[]): CartItemView[] {
  return cart.map(l => {
    const p = catalog[l.productId]
    return {
      id: p.id,
      name: p.name,
      priceNOK: p.priceNOK,
      qty: l.qty,
      lineTotalNOK: p.priceNOK * l.qty
    }
  })
}

export function countItems(cart: CartLine[]): number {
  return cart.reduce((n, l) => n + l.qty, 0)
}

// useCart presenter hook
import { useMemo, useReducer, useCallback } from 'react'

export function useCart(initial: CartLine[] = []) {
  const [cart, dispatch] = useReducer(cartReducer, initial)

  const items = useMemo(() => mapCartItems(cart), [cart])
  const totalNOK = useMemo(() => calcTotal(cart), [cart])
  const itemCount = useMemo(() => countItems(cart), [cart])

  const add = useCallback((productId: string) => dispatch({ type: 'add', productId }), [])
  const remove = useCallback((productId: string) => dispatch({ type: 'remove', productId }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  return { cart, items, totalNOK, itemCount, add, remove, clear }
}
