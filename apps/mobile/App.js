import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { SafeAreaView, Text, Button, FlatList, View } from 'react-native';
import { catalog, useCart } from '@poc/shared';
export default function App() {
    const { totalNOK, add } = useCart();
    const data = Object.values(catalog);
    return (_jsxs(SafeAreaView, { children: [_jsx(Text, { style: { fontSize: 24, margin: 16 }, children: "POC Mobile" }), _jsx(FlatList, { data: data, keyExtractor: p => p.id, renderItem: ({ item }) => (_jsxs(View, { style: { paddingHorizontal: 16, paddingVertical: 8 }, children: [_jsxs(Text, { children: [item.name, " \u2014 ", item.priceNOK, " NOK"] }), _jsx(Button, { title: "Add", onPress: () => add(item.id) })] })) }), _jsxs(Text, { style: { fontSize: 18, margin: 16 }, children: ["Total: ", totalNOK, " NOK"] })] }));
}
