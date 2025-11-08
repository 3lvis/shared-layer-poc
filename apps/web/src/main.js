import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { catalog, useCart } from '@poc/shared';
function App() {
    const { totalNOK, add } = useCart();
    return (_jsxs("main", { style: { fontFamily: 'system-ui', padding: 16 }, children: [_jsx("h1", { children: "POC Web" }), _jsx("ul", { children: Object.values(catalog).map(p => (_jsxs("li", { style: { marginBottom: 8 }, children: [p.name, " \u2014 ", p.priceNOK, " NOK", _jsx("button", { style: { marginLeft: 8 }, onClick: () => add(p.id), children: "Add" })] }, p.id))) }), _jsxs("div", { children: [_jsx("strong", { children: "Total:" }), " ", totalNOK, " NOK"] })] }));
}
createRoot(document.getElementById('root')).render(_jsx(App, {}));
