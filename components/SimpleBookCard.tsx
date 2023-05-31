import { FC } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { Book } from '../Interfaces'
import { RootStackParamList } from '../Types'
import { ImageLoader } from '../ui/ImageLoader'
import { COLORS } from '../GlobalStyles'

interface Props {
  book: Book
  lastChild?: boolean
}

export const SimpleBookCard: FC<Props> = ({ book, lastChild }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const handlePress = () => {
    navigation.navigate('BookDetails', { volumeId: book.volumeId })
  }

  return (
    <Pressable style={[styles.wrapper, lastChild && styles.lastChild]} onPress={handlePress}>
      <ImageLoader style={styles.image} source={{ uri: book.image }} borderRadius={10} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginLeft: 20,
  },
  lastChild: {
    marginRight: 20,
  },
  image: {
    borderRadius: 10,
    height: 170,
    aspectRatio: 2 / 3,
  },
  ownedTag: {
    position: 'absolute',
    top: 10,
    right: 0,
    backgroundColor: COLORS.accentLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  ownedText: {
    fontSize: 12,
    color: COLORS.white,
  },
})
