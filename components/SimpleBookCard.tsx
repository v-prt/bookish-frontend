import { StyleSheet, Pressable, Image } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { Book } from '../Interfaces'
import { RootStackParamList } from '../Types'

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
      <Image style={styles.image} source={{ uri: book.image }} />
      {/* TODO: add actions (rate / add to "want to read") */}
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
    borderRadius: 5,
    height: 200,
    width: 150,
  },
})
