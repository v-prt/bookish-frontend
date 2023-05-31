import { FC } from 'react'
import { StyleSheet, Pressable, View, Text } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { COLORS } from '../GlobalStyles'
import { Book } from '../Interfaces'
import { RootStackParamList } from '../Types'
import { MaterialIcons } from '@expo/vector-icons'
import { ImageLoader } from '../ui/ImageLoader'
import moment from 'moment'

interface Props {
  book: Book
}

export const DetailedBookCard: FC<Props> = ({ book }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const handlePress = () => {
    navigation.navigate('BookDetails', { volumeId: book.volumeId })
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <ImageLoader style={styles.image} source={{ uri: book.image }} borderRadius={10} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author}>by {book.author || 'Unknown Author'}</Text>

        <View style={styles.ratingContainer}>
          <MaterialIcons name='star' size={16} color={book.averageRating ? 'gold' : '#ccc'} />
          <Text style={styles.rating}>{book.averageRating || 'No rating'}</Text>
          {book.ratingsCount > 0 && (
            <Text style={styles.ratingsCount}>
              ({book.ratingsCount.toLocaleString()} rating{book.ratingsCount > 1 && 's'})
            </Text>
          )}
          {book.rating && (
            <>
              <View style={styles.divider} />
              <MaterialIcons
                name='star'
                size={16}
                color={book.rating ? COLORS.accentLight : '#ccc'}
              />
              <Text style={styles.rating}>{book.rating}</Text>
            </>
          )}
        </View>

        {book.bookshelf && (
          <View style={styles.userBookInfo}>
            <View style={styles.bookshelfTag}>
              <Text style={styles.bookshelfTagText}>{book.bookshelf}</Text>
            </View>
            {book.dateRead && (
              <Text style={styles.dateRead}>{moment(book.dateRead).format('ll')}</Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    // android shadow
    elevation: 4,
    // ios shadow
    shadowColor: COLORS.primary600,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  image: {
    backgroundColor: COLORS.primary200,
    borderRadius: 10,
    height: 125,
    aspectRatio: 2 / 3,
  },
  textContainer: {
    padding: 10,
    maxWidth: '70%',
    marginLeft: 10,
  },
  title: {
    color: COLORS.primary900,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
  },
  author: {
    color: COLORS.primary500,
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
  },
  ratingContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 3,
  },
  rating: {
    fontFamily: 'RobotoMono-Bold',
    color: COLORS.primary600,
  },
  ratingsCount: {
    color: COLORS.primary500,
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.primary300,
    marginHorizontal: 5,
  },
  userBookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  bookshelfTag: {
    backgroundColor: COLORS.accentDark,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    opacity: 0.4,
  },
  bookshelfTagText: {
    color: COLORS.white,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateRead: {
    color: COLORS.accentDark,
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
    opacity: 0.4,
  },
})
