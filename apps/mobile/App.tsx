/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { SafeAreaView, Text, Button, View } from 'react-native'
import { useCounter } from '@axis/shared'

export default function App() {
  const { count, inc, dec, reset } = useCounter(0)
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 24, margin: 16 }}>Axis Mobile</Text>
      <Text style={{ color: '#666', marginHorizontal: 16 }}>Minimal template without cart/grocery logic.</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, margin: 16 }}>
        <Button title="-" onPress={dec} testID="dec" />
        <Text testID="count" style={{ fontSize: 18, marginHorizontal: 12 }}>{count}</Text>
        <Button title="+" onPress={inc} testID="inc" />
        <View style={{ width: 8 }} />
        <Button title="Reset" onPress={reset} testID="reset" />
      </View>
    </SafeAreaView>
  )
}
