import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useCounter } from '@axis/shared';
function App() {
    const { count, inc, dec, reset } = useCounter(0);
    return (_jsxs("main", { style: { fontFamily: 'system-ui', padding: 16 }, children: [_jsx("h1", { children: "Axis Web" }), _jsx("p", { style: { color: '#555' }, children: "Minimal template without cart/grocery logic." }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("button", { onClick: dec, "data-testid": "dec", children: "-" }), _jsx("div", { "data-testid": "count", style: { minWidth: 24, textAlign: 'center' }, children: count }), _jsx("button", { onClick: inc, "data-testid": "inc", children: "+" }), _jsx("button", { onClick: reset, "data-testid": "reset", children: "Reset" })] })] }));
}
createRoot(document.getElementById('root')).render(_jsx(App, {}));
