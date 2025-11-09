import React from 'react'
import { createRoot } from 'react-dom/client'
import { catalog, useCart } from '@axis/shared'

function AdminApp() {
  const { items, add, remove, clear, totalNOK } = useCart()
  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>Axis Admin</h1>
      <section>
        <h2 style={{ marginTop: 0 }}>Catalog</h2>
        <ul>
          {Object.values(catalog).map(p => (
            <li key={p.id} style={{ marginBottom: 12 }}>
              <div><strong>{p.name}</strong> — {p.priceNOK} NOK</div>
              <div style={{ color: '#555' }}>{p.description}</div>
              <button style={{ marginTop: 4 }} onClick={() => add(p.id)}>
                Add to test cart
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Test Cart</h2>
        {items.length === 0 ? (
          <div style={{ color: '#666' }}>Cart is empty</div>
        ) : (
          <ul>
            {items.map(l => (
              <li key={l.id} style={{ marginBottom: 8 }}>
                {l.name} x{l.qty} — {l.lineTotalNOK} NOK
                <button style={{ marginLeft: 8 }} onClick={() => remove(l.id)}>-</button>
                <button style={{ marginLeft: 4 }} onClick={() => add(l.id)}>+</button>
              </li>
            ))}
          </ul>
        )}
        <div><strong>Total:</strong> {totalNOK} NOK</div>
        <button style={{ marginTop: 8 }} onClick={() => clear()}>Clear cart</button>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<AdminApp />)

