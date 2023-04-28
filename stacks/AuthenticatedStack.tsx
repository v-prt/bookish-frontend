import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS } from '../GlobalStyles'
import { Home } from '../screens/Home'
import { Search } from '../screens/Search'
import { BookDetails } from '../screens/BookDetails'
import { Library } from '../screens/Library'

const Stack = createNativeStackNavigator()
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

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name='Search' component={Search} />
      <Stack.Screen name='BookDetails' component={BookDetails} />
    </Stack.Navigator>
  )
}

export const AuthenticatedStack: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name='Home' component={Home} />
        <Tab.Screen name='SearchStack' component={SearchStack} options={{ headerShown: false }} />
        <Tab.Screen name='Library' component={Library} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
