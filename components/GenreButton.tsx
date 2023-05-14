import { View, Pressable, StyleSheet, Text, Dimensions } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { ImageLoader } from '../ui/ImageLoader'

interface Props {
  label: string
  image?: any
  onPress: () => void
}

const { width } = Dimensions.get('window')
const gap = 20
const itemPerRow = 2
const totalGapSize = gap * (itemPerRow + 1)
const windowWidth = width
const childWidth = (windowWidth - totalGapSize) / itemPerRow

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
    height: 150,
    margin: gap / 2,
    minWidth: childWidth,
    maxWidth: childWidth,
    backgroundColor: COLORS.primary200,
    borderRadius: 20,
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
    fontFamily: 'RobotoMono-Bold',
    color: COLORS.white,
    fontSize: 20,
    maxWidth: '80%',
  },
})
