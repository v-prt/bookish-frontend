import * as Font from 'expo-font'

export const useFonts = async () => {
  await Font.loadAsync({
    'RobotoMono-Italic': require('../assets/fonts/RobotoMono-Italic.ttf'),
    'RobotoMono-Light': require('../assets/fonts/RobotoMono-Light.ttf'),
    'RobotoMono-Regular': require('../assets/fonts/RobotoMono-Regular.ttf'),
    'RobotoMono-Medium': require('../assets/fonts/RobotoMono-Medium.ttf'),
    'RobotoMono-Bold': require('../assets/fonts/RobotoMono-Bold.ttf'),
  })
}
