import React from 'react'
import { createRoot } from 'react-dom/client'
import { useCounter } from '@axis/shared'

function AdminApp() {
  const { count, inc, dec, reset } = useCounter(10)
  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>Axis Admin</h1>
      <p style={{ color: '#555' }}>Simple counter demo; no cart domain.</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={dec}>-</button>
        <div style={{ minWidth: 24, textAlign: 'center' }}>{count}</div>
        <button onClick={inc}>+</button>
        <button onClick={reset}>Reset</button>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<AdminApp />)
