import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, Image } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { Home } from '../screens/Home'
import { Search } from '../screens/Search'
import { BookDetails } from '../screens/BookDetails'
import { Library } from '../screens/Library'
import { Profile } from '../screens/Profile'
import { Settings } from '../screens/Settings'

const homeIcon = require('../assets/icons/home.png')
const searchIcon = require('../assets/icons/search.png')
const libraryIcon = require('../assets/icons/library.png')
const profileIcon = require('../assets/icons/profile.png')

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const screenOptions = {
  headerShown: false,
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
  tabBarLabel: () => null,
}

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name='Search' component={Search} />
      <Stack.Screen name='BookDetails' component={BookDetails} />
    </Stack.Navigator>
  )
}

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen
        name='Settings'
        component={Settings}
        options={{
          headerShown: true,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}

export const AuthenticatedStack: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={homeIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
          ),
        }}
      />
      <Tab.Screen
        name='SearchStack'
        component={SearchStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={searchIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
          ),
        }}
      />
      <Tab.Screen
        name='Library'
        component={Library}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={libraryIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
          ),
        }}
      />
      <Tab.Screen
        name='ProfileStack'
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={profileIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabIcon: {
    height: 25,
    width: 25,
    tintColor: COLORS.primary500,
  },
  tabFocused: {
    tintColor: COLORS.primary900,
  },
})
