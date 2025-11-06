import React from 'react'
import { createRoot } from 'react-dom/client'
import { catalog, useCart } from '@poc/shared'

function App() {
  const { totalNOK, add } = useCart()
  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>POC Web</h1>
      <ul>
        {Object.values(catalog).map(p => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            {p.name} — {p.priceNOK} NOK
            <button style={{ marginLeft: 8 }} onClick={() => add(p.id)}>
              Add
            </button>
          </li>
        ))}
      </ul>
      <div><strong>Total:</strong> {totalNOK} NOK</div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
