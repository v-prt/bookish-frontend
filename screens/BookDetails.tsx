import { useEffect, useState, useContext } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native'
import { useQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { BookContext } from '../contexts/BookContext'
import { COLORS } from '../GlobalStyles'
import RenderHtml from 'react-native-render-html'
import { MaterialIcons } from '@expo/vector-icons'
import { ImageLoader } from '../components/ImageLoader'
import moment from 'moment'

interface Props {
  navigation: any
  route: any
}

export const BookDetails: React.FC<Props> = ({
  navigation,
  route: {
    params: { id },
  },
}: any) => {
  const { userId } = useContext(UserContext)
  const { fetchBook } = useContext(BookContext)
  const [book, setBook] = useState<any>(null)
  const { width } = useWindowDimensions()
  const [genres, setGenres] = useState<string | null>(null)

  const { data: googleBookData, status: googleBookStatus } = useQuery(['google-book', id], () =>
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`).then(res => res.json())
  )

  const { data: userBookData } = useQuery(['user-book', id], () => fetchBook(userId, id))

  const actionBtnStyles = userBookData
    ? [styles.actionBtn, styles.primaryActionBtn]
    : [styles.actionBtn, styles.secondaryActionBtn]

  const actionTextStyles = userBookData
    ? [styles.actionText, styles.primaryActionText]
    : [styles.actionText, styles.secondaryActionText]

  useEffect(() => {
    if (googleBookData) {
      setBook(googleBookData.volumeInfo)
    }
  })

  useEffect(() => {
    if (book?.categories?.length > 0) {
      // clean up categories (remove slashes and duplicate words)
      let cats = [
        ...new Set(book.categories.map((string: string) => string.split(' / ')).flat()),
      ] as string[]

      // create a text string with all categories separated by a bullet
      let text = cats.map((string: string) => string).join(' • ') as string

      setGenres(text)
    }
  }, [book])

  const renderStars = () => {
    let stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={
            book.averageRating > i + 0.5
              ? 'star'
              : book.averageRating > i && book.averageRating < i + 1
              ? 'star-half'
              : 'star-border'
          }
          size={18}
          color={book.averageRating > i ? 'gold' : '#ccc'}
        />
      )
    }
    return stars
  }

  return (
    <View style={styles.screen}>
      {(googleBookStatus === 'loading' || !book) && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary300} />
        </View>
      )}

      {googleBookStatus === 'success' && book && (
        <ScrollView style={styles.book}>
          <View style={styles.basicInfo}>
            <ImageLoader
              style={styles.image}
              source={{ uri: book.imageLinks?.thumbnail }}
              borderRadius={10}
            />
            <View style={styles.text}>
              <Text style={styles.title}>{book.title}</Text>
              {book.subtitle && <Text style={styles.subtitle}>{book.subtitle}</Text>}
              <Text style={styles.author}>by {book.authors?.join(', ')}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStars()}
              <Text style={styles.rating}>{book.averageRating || 'No rating'}</Text>
            </View>
            {book.ratingsCount > 0 && (
              <Text style={styles.ratingsCount}>
                ({book.ratingsCount.toLocaleString()} rating{book.ratingsCount > 1 && 's'})
              </Text>
            )}
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() =>
                navigation.navigate('ManageBook', {
                  volumeId: id,
                  existingBook: userBookData,
                })
              }
              style={actionBtnStyles}>
              <Text style={actionTextStyles}>
                {userBookData?.bookshelf || 'Add to Library'}
                {userBookData?.owned && ' (Owned)'}
              </Text>
              <MaterialIcons
                name={userBookData ? 'edit' : 'add'}
                size={24}
                color={userBookData ? COLORS.white : COLORS.accentLight}
              />
            </Pressable>
          </View>

          <View style={styles.details}>
            <Text style={styles.headerText}>Description</Text>
            <View style={styles.divider}></View>
            <View style={styles.description}>
              <RenderHtml contentWidth={width} source={{ html: book.description }} />
            </View>

            <Text style={styles.headerText}>Details</Text>
            <View style={styles.divider}></View>
            <Text style={styles.detailsText}>
              <Text style={styles.label}>Genres: </Text>
              {genres || ' Unknown'}
            </Text>
            <Text style={styles.detailsText}>
              <Text style={styles.label}>Publisher: </Text>
              {book.publisher || 'Unknown'}
            </Text>
            <Text style={styles.detailsText}>
              <Text style={styles.label}>Published: </Text>
              {book.publishedDate ? moment(book.publishedDate).format('LL') : 'Unknown'}
            </Text>
            <Text style={styles.detailsText}>
              <Text style={styles.label}>Pages: </Text>
              {book.pageCount || 'Unknown'}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  book: {
    flex: 1,
  },
  basicInfo: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary300,
  },
  text: {
    maxWidth: '60%',
  },
  image: {
    backgroundColor: COLORS.primary200,
    borderRadius: 10,
    height: 150,
    aspectRatio: 2 / 3,
  },
  title: {
    color: COLORS.accentDark,
    fontFamily: 'Prata-Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.accentDark,
    fontSize: 16,
    fontStyle: 'italic',
  },
  author: {
    fontFamily: 'Heebo-Regular',
    color: COLORS.primary600,
    fontSize: 18,
    marginTop: 5,
  },
  ratingContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary300,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    fontFamily: 'Heebo-Bold',
    color: COLORS.primary600,
    marginLeft: 5,
    fontSize: 16,
  },
  ratingsCount: {
    color: COLORS.primary500,
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
  },
  details: {
    padding: 20,
  },
  headerText: {
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
    marginBottom: 8,
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.accentDark,
    marginBottom: 20,
    opacity: 0.6,
  },
  description: {
    marginBottom: 30,
  },
  detailsText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: COLORS.primary700,
    marginBottom: 10,
  },
  label: {
    fontFamily: 'Heebo-Bold',
  },
  actions: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary300,
  },
  actionBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.accentLight,
    borderColor: COLORS.accentLight,
  },
  secondaryActionBtn: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.accentLight,
  },
  actionText: {
    fontFamily: 'Heebo-Bold',
    fontSize: 16,
  },
  primaryActionText: {
    color: COLORS.white,
  },
  secondaryActionText: {
    color: COLORS.accentLight,
  },
})
