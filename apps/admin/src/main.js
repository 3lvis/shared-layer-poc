import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useCounter } from '@axis/shared';
function AdminApp() {
    const { count, inc, dec, reset } = useCounter(10);
    return (_jsxs("main", { style: { fontFamily: 'system-ui', padding: 16 }, children: [_jsx("h1", { children: "Axis Admin" }), _jsx("p", { style: { color: '#555' }, children: "Simple counter demo; no cart domain." }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("button", { onClick: dec, children: "-" }), _jsx("div", { style: { minWidth: 24, textAlign: 'center' }, children: count }), _jsx("button", { onClick: inc, children: "+" }), _jsx("button", { onClick: reset, children: "Reset" })] })] }));
}
createRoot(document.getElementById('root')).render(_jsx(AdminApp, {}));
