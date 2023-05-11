import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, Image, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { Home } from '../screens/Home'
import { Search } from '../screens/Search'
import { BookDetails } from '../screens/BookDetails'
import { Library } from '../screens/Library'
import { Profile } from '../screens/Profile'
import { Settings } from '../screens/Settings'
import { IconButton } from '../ui/IconButton'
import { ManageBook } from '../screens/ManageBook'

const homeIcon = require('../assets/icons/home.png')
const searchIcon = require('../assets/icons/search.png')
const libraryIcon = require('../assets/icons/library.png')
const profileIcon = require('../assets/icons/profile.png')

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const screenOptions = {
  // headerShown: false,
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

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
          // headerTitle: () => <Text style={styles.logo}>bookish</Text>,
        }}
      />
      <Stack.Screen
        name='BookDetails'
        component={BookDetails}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name='ManageBook'
        component={ManageBook}
        options={({ navigation }) => ({
          title: 'Manage Book',
          presentation: 'modal',
          headerLeft: () => (
            <IconButton
              icon='close'
              color={COLORS.primary600}
              onPress={() => {
                navigation.goBack()
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  )
}

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name='Search'
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='BookDetails'
        component={BookDetails}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name='ManageBook'
        component={ManageBook}
        options={({ navigation }) => ({
          title: 'Manage Book',
          presentation: 'modal',
          headerLeft: () => (
            <IconButton
              icon='close'
              color={COLORS.primary600}
              onPress={() => {
                navigation.goBack()
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  )
}

const LibraryStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name='Library'
        component={Library}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>My Library</Text>,
        }}
      />
      <Stack.Screen
        name='BookDetails'
        component={BookDetails}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name='ManageBook'
        component={ManageBook}
        options={({ navigation }) => ({
          title: 'Manage Book',
          presentation: 'modal',
          headerLeft: () => (
            <IconButton
              icon='close'
              color={COLORS.primary600}
              onPress={() => {
                navigation.goBack()
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  )
}

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Settings'
        component={Settings}
        options={{
          title: 'My Settings',
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
        name='HomeStack'
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image source={homeIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
          ),
        }}
      />
      <Tab.Screen
        name='SearchStack'
        component={SearchStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image source={searchIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
          ),
        }}
      />
      <Tab.Screen
        name='LibraryStack'
        component={LibraryStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image source={libraryIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
          ),
        }}
      />
      <Tab.Screen
        name='ProfileStack'
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image source={profileIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  logo: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 26,
    color: COLORS.accentDark,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'RobotoMono-Bold',
    color: COLORS.primary700,
  },
  tabIcon: {
    height: 25,
    width: 25,
    tintColor: COLORS.primary500,
  },
  tabFocused: {
    tintColor: COLORS.primary900,
  },
})
