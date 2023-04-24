import { ImageBackground, View, Pressable, StyleSheet } from 'react-native'
import { SerifText } from '../ui/SerifText'
import { COLORS } from '../GlobalStyles'

interface Props {
  label: string
  image?: any
  onPress: () => void
}

export const GenreButton: React.FC<Props> = ({ label, image, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        <View style={styles.textContainer}>
          <SerifText style={styles.text}>{label}</SerifText>
        </View>
      </ImageBackground>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    height: 150,
    backgroundColor: COLORS.primary200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 18,
  },
})
