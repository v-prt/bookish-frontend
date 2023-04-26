import { StyleSheet, Pressable, View, Image } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { COLORS } from '../GlobalStyles'
import { Book, RootStackParamList } from '../types'
import { SerifText } from '../ui/SerifText'
import { SansSerifText } from '../ui/SansSerifText'
import { MaterialIcons } from '@expo/vector-icons'

interface Props {
  book: Book
}

export const BookCard: React.FC<Props> = ({ book }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const handlePress = () => {
    navigation.navigate('BookDetails', { id: book.id })
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image style={styles.image} source={{ uri: book.image }} />
      <View style={styles.textContainer}>
        <SerifText style={styles.title}>{book.title}</SerifText>
        <SansSerifText style={styles.author}>by {book.author || 'Unknown Author'}</SansSerifText>
        <View style={styles.ratingContainer}>
          <MaterialIcons name='star' size={18} color={book.averageRating ? 'gold' : '#ccc'} />
          <SansSerifText style={styles.rating} bold>
            {book.averageRating || 'No rating'}
          </SansSerifText>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  image: {
    backgroundColor: COLORS.primary300,
    borderRadius: 10,
    height: 100,
    width: 75,
  },
  textContainer: {
    maxWidth: '70%',
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
  },
  author: {
    color: COLORS.primary500,
    fontSize: 14,
  },
  ratingContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 3,
  },
  rating: {
    color: COLORS.primary600,
  },
})
