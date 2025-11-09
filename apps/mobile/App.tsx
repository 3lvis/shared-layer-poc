/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { SafeAreaView, Text, Button, FlatList, View } from 'react-native'
import { catalog, useCart, type Product } from '@axis/shared'

export default function App() {
  const { totalNOK, add } = useCart()
  const data: Product[] = Object.values(catalog)
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 24, margin: 16 }}>Axis Mobile</Text>
      <FlatList
        data={data}
        keyExtractor={p => p.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ fontWeight: '600' }}>{item.name} — {item.priceNOK} NOK</Text>
            <Text style={{ color: '#666', marginBottom: 4 }}>{item.description}</Text>
            <Button
              title="Add"
              testID={`add-button-${item.id}`}
              onPress={() => add(item.id)}
            />
          </View>
        )}
      />
      <Text
        testID="cart-total"
        style={{ fontSize: 18, margin: 16 }}
      >
        Total: {totalNOK} NOK
      </Text>
    </SafeAreaView>
  )
}
