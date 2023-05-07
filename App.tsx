import React, { useContext, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SafeAreaView, StyleSheet } from 'react-native'
import { setCustomText } from 'react-native-global-props'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { COLORS, customTextProps } from './GlobalStyles'
import { UserContext, UserProvider } from './contexts/UserContext'
import { useFonts } from './hooks/useFonts'
import { UnauthenticatedStack } from './stacks/UnauthenticatedStack'
import { AuthenticatedStack } from './stacks/AuthenticatedStack'
import { BookProvider } from './contexts/BookContext'

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync()

const Root = () => {
  const { authenticated } = useContext(UserContext)

  return (
    <SafeAreaView style={styles.app}>
      <NavigationContainer>
        {authenticated ? <AuthenticatedStack /> : <UnauthenticatedStack />}
      </NavigationContainer>
    </SafeAreaView>
  )
}

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
      <UserProvider>
        <BookProvider>
          <StatusBar style='dark' />
          <Root />
        </BookProvider>
      </UserProvider>
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
