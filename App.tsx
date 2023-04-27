import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SafeAreaView, StyleSheet } from 'react-native'
import { setCustomText } from 'react-native-global-props'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { COLORS, customTextProps } from './GlobalStyles'
import { useFonts } from './hooks/useFonts'
import { AuthenticatedStack } from './stacks/AuthenticatedStack'

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync()

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
      await new Promise(resolve => setTimeout(resolve, 1000))
      await SplashScreen.hideAsync()
    }

    if (appReady) {
      prepare()
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
        {/* TODO: add unauthenticated stack */}
        <AuthenticatedStack />
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
