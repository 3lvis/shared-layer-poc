import React from 'react'
import { createRoot } from 'react-dom/client'
import { catalog, useCart } from '@axis/shared'

function App() {
  const { totalNOK, add } = useCart()
  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>Axis Web</h1>
      <ul>
        {Object.values(catalog).map(p => (
          <li key={p.id} style={{ marginBottom: 12 }}>
            <div><strong>{p.name}</strong> — {p.priceNOK} NOK</div>
            <div style={{ color: '#555' }}>{p.description}</div>
            <button
              style={{ marginLeft: 8 }}
              data-testid={`add-button-${p.id}`}
              onClick={() => add(p.id)}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
      <div data-testid="cart-total"><strong>Total:</strong> {totalNOK} NOK</div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
