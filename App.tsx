import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { COLORS } from './GlobalStyles'
import { Home } from './screens/Home'
import { Library } from './screens/Library'

export type Props = {
  // TODO: Add props here
}

const Tab = createBottomTabNavigator()

const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.secondary,
  },
  headerTintColor: COLORS.accentDark,
  headerShadowVisible: false,
  tabBarStyle: {
    backgroundColor: COLORS.secondary,
    borderTopWidth: 0,
  },
  tabBarInactiveTintColor: COLORS.grey,
  tabBarActiveTintColor: COLORS.accentDark,
}

// React.FC is a type that represents a function component
const App: React.FC<Props> = (
  {
    // TODO: Pass in props here
  }
) => {
  return (
    <View style={styles.app}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name='Home' component={Home} />
          <Tab.Screen name='Library' component={Library} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: COLORS.accentLight,
    flex: 1,
  },
})

export default App
