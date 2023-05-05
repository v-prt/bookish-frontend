import { StyleSheet, Pressable, View, Image, Text } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { COLORS } from '../GlobalStyles'
import { Book } from '../Interfaces'
import { RootStackParamList } from '../Types'
import { MaterialIcons } from '@expo/vector-icons'
import { ImageLoader } from './ImageLoader'

interface Props {
  book: Book
}

export const DetailedBookCard: React.FC<Props> = ({ book }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const handlePress = () => {
    navigation.navigate('BookDetails', { id: book.id })
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <ImageLoader style={styles.image} source={{ uri: book.image }} borderRadius={5} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author}>by {book.author || 'Unknown Author'}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name='star' size={18} color={book.averageRating ? 'gold' : '#ccc'} />
          <Text style={styles.rating}>{book.averageRating || 'No rating'}</Text>
          {book.ratingsCount > 0 && (
            <Text style={styles.ratingsCount}>
              • ({book.ratingsCount.toLocaleString()} rating{book.ratingsCount > 1 && 's'})
            </Text>
          )}
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
    backgroundColor: COLORS.primary200,
    borderRadius: 5,
    height: 110,
    aspectRatio: 2 / 3,
  },
  textContainer: {
    maxWidth: '70%',
    marginLeft: 10,
  },
  title: {
    color: COLORS.primary900,
    fontFamily: 'Prata-Regular',
    fontSize: 16,
  },
  author: {
    color: COLORS.primary500,
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
  },
  ratingContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 3,
  },
  rating: {
    fontFamily: 'Heebo-Bold',
    color: COLORS.primary600,
  },
  ratingsCount: {
    color: COLORS.primary500,
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
  },
})