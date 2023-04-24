import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SafeAreaView, StyleSheet } from 'react-native'
import { setCustomText } from 'react-native-global-props'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { COLORS, customTextProps } from './GlobalStyles'
import { Home } from './screens/Home'
import { Search } from './screens/Search'
import { Library } from './screens/Library'
import { useFonts } from './hooks/useFonts'

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync()

const Tab = createBottomTabNavigator()

const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.primary300,
  },
  headerTintColor: COLORS.accentDark,
  headerShadowVisible: false,
  tabBarStyle: {
    backgroundColor: COLORS.primary300,
    borderTopWidth: 0,
  },
  tabBarInactiveTintColor: COLORS.grey,
  tabBarActiveTintColor: COLORS.accentDark,
}

// React.FC is a type that represents a function component
const App: React.FC = () => {
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const loadFonts = async () => {
      await useFonts()
      setAppReady(true)
    }
    loadFonts()
  }, [])

  useEffect(() => {
    const prepare = async () => {
      // simulate longer loading by waiting 1 second
      //  await new Promise(resolve => setTimeout(resolve, 1000))
      await SplashScreen.hideAsync()
    }

    if (appReady) {
      prepare()
      // FIXME: text styles not working
      setCustomText(customTextProps)
    }
  }, [appReady])

  if (!appReady) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.app}>
        <StatusBar style='dark' />
        <NavigationContainer>
          <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name='Home' component={Home} />
            <Tab.Screen name='Search' component={Search} options={{ headerShown: false }} />
            <Tab.Screen name='Library' component={Library} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: COLORS.primary300,
    flex: 1,
  },
})

export default App
