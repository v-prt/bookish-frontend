import * as Font from 'expo-font'

export const useFonts = async () => {
  await Font.loadAsync({
    // LOGO / HEADER TEXT
    'Prata-Regular': require('../assets/fonts/Prata-Regular.ttf'),

    // STYLIZED LOGO TEXT
    'CormorantGaramond-LightItalic': require('../assets/fonts/CormorantGaramond-LightItalic.ttf'),

    // SUBHEADER / BODY / BUTTON TEXT
    'Heebo-Regular': require('../assets/fonts/Heebo-Regular.ttf'),
    'Heebo-Bold': require('../assets/fonts/Heebo-Bold.ttf'),
    'FragmentMono-Regular': require('../assets/fonts/FragmentMono-Regular.ttf'),
    'FragmentMono-Italic': require('../assets/fonts/FragmentMono-Italic.ttf'),
  })
}
