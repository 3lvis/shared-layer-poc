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

