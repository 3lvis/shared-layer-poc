import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { SafeAreaView, Text, Button, View } from 'react-native';
import { useCounter } from '@axis/shared';
export default function App() {
    const { count, inc, dec, reset } = useCounter(0);
    return (_jsxs(SafeAreaView, { children: [_jsx(Text, { style: { fontSize: 24, margin: 16 }, children: "Axis Mobile" }), _jsx(Text, { style: { color: '#666', marginHorizontal: 16 }, children: "Minimal template without cart/grocery logic." }), _jsxs(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 16 }, children: [_jsx(Button, { title: "-", onPress: dec }), _jsx(Text, { testID: "count", style: { fontSize: 18, marginHorizontal: 12 }, children: count }), _jsx(Button, { title: "+", onPress: inc }), _jsx(View, { style: { width: 8 } }), _jsx(Button, { title: "Reset", onPress: reset })] })] }));
}
