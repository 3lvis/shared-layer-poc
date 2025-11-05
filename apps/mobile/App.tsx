/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react'
import { SafeAreaView, Text, Button, FlatList, View } from 'react-native'
import { catalog, addToCart, calcTotal, type CartLine, type Product } from '@poc/shared'

export default function App() {
  const [cart, setCart] = useState<CartLine[]>([])
  const data: Product[] = Object.values(catalog)
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 24, margin: 16 }}>POC Mobile</Text>
      <FlatList
        data={data}
        keyExtractor={p => p.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text>{item.name} — {item.priceNOK} NOK</Text>
            <Button title="Add" onPress={() => setCart(c => addToCart(c, item.id))} />
          </View>
        )}
      />
      <Text style={{ fontSize: 18, margin: 16 }}>Total: {calcTotal(cart)} NOK</Text>
    </SafeAreaView>
  )
}
