import * as Font from 'expo-font'

export const useFonts = async () => {
  await Font.loadAsync({
    'Prata-Regular': require('../assets/fonts/Prata-Regular.ttf'),
    'CormorantGaramond-LightItalic': require('../assets/fonts/CormorantGaramond-LightItalic.ttf'),
    'Heebo-Regular': require('../assets/fonts/Heebo-Regular.ttf'),
    'Heebo-Bold': require('../assets/fonts/Heebo-Bold.ttf'),
  })
}
