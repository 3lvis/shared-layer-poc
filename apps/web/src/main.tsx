import React from 'react'
import { createRoot } from 'react-dom/client'
import { useCounter } from '@axis/shared'

function App() {
  const { count, inc, dec, reset } = useCounter(0)
  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>Axis Web</h1>
      <p style={{ color: '#555' }}>Minimal template without cart/grocery logic.</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={dec} data-testid="dec">-</button>
        <div data-testid="count" style={{ minWidth: 24, textAlign: 'center' }}>{count}</div>
        <button onClick={inc} data-testid="inc">+</button>
        <button onClick={reset} data-testid="reset">Reset</button>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
