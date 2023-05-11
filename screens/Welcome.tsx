import { StyleSheet, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { ImageLoader } from '../ui/ImageLoader'
import { CustomButton } from '../ui/CustomButton'
const books = require('../assets/images/books-illustration.jpg')

interface Props {
  navigation: any
}

export const Welcome: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.logo}>
        book
        <Text style={styles.italic}>ish</Text>
      </Text>
      <Text style={styles.subtitle}>Your bookshelf, in your pocket.</Text>
      <ImageLoader style={styles.image} source={books} borderRadius={20} />
      <View style={styles.buttons}>
        <CustomButton
          type='primary'
          label='Sign Up'
          onPress={() => navigation.navigate('Signup')}
        />
        <CustomButton
          type='secondary'
          label='Log In'
          onPress={() => navigation.navigate('Login')}
        />
      </View>
      <Text style={styles.terms}>
        By joining Bookish, you agree to our <Text style={styles.bold}>Terms of Service</Text> and{' '}
        <Text style={styles.bold}>Privacy Policy</Text>.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    marginVertical: 30,
  },
  logo: {
    color: COLORS.accentDark,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 60,
  },
  italic: {
    fontFamily: 'RobotoMono-Italic',
  },
  subtitle: {
    color: COLORS.accentDark,
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
  },
  buttons: {
    width: '100%',
    gap: 20,
  },
  terms: {
    width: '85%',
    color: COLORS.primary700,
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  bold: {
    fontFamily: 'RobotoMono-Bold',
  },
})
