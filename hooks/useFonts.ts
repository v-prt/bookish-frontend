import * as Font from 'expo-font'

export const useFonts = async () => {
  await Font.loadAsync({
    'Prata-Regular': require('../assets/fonts/Prata-Regular.ttf'),
    'Heebo-Regular': require('../assets/fonts/Heebo-Regular.ttf'),
    'Heebo-Bold': require('../assets/fonts/Heebo-Bold.ttf'),
  })
}
