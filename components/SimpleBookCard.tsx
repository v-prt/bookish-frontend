import { StyleSheet, Pressable } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { Book } from '../Interfaces'
import { RootStackParamList } from '../Types'
import { ImageLoader } from './ImageLoader'

interface Props {
  book: Book
  lastChild?: boolean
}

export const SimpleBookCard: React.FC<Props> = ({ book, lastChild }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const handlePress = () => {
    navigation.navigate('BookDetails', { id: book.id })
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
    height: 150,
    aspectRatio: 2 / 3,
  },
})
