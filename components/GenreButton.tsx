import { View, Pressable, StyleSheet, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { ImageLoader } from '../ui/ImageLoader'

interface Props {
  label: string
  image?: any
  onPress: () => void
}

export const GenreButton: React.FC<Props> = ({ label, image, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.imageWrapper}>
        <ImageLoader source={image} borderRadius={10} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{label}</Text>
      </View>
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
  imageWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Prata-Regular',
    color: COLORS.white,
    fontSize: 18,
  },
})
