import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

export type Props = {
  // TODO: Add props here
}

// React.FC is a type that represents a function component
const App: React.FC<Props> = (
  {
    // TODO: Pass in props here
  }
) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookish App</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
  },
})

export default App
