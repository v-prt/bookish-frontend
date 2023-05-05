import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import { useQuery } from 'react-query'
import { COLORS } from '../GlobalStyles'
import RenderHtml from 'react-native-render-html'
import { MaterialIcons } from '@expo/vector-icons'
import { ImageLoader } from '../components/ImageLoader'
import moment from 'moment'

export const BookDetails = ({
  route: {
    params: { id },
  },
}: any) => {
  const [book, setBook] = useState<any>(null)
  const { width } = useWindowDimensions()
  const [genres, setGenres] = useState<string | null>(null)

  const { data, status } = useQuery(['book', id], () =>
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`).then(res => res.json())
  )

  useEffect(() => {
    if (data) {
      setBook(data.volumeInfo)
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

  return (
    <View style={styles.screen}>
      {(status === 'loading' || !book) && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary300} />
        </View>
      )}

      {status === 'success' && book && (
        <ScrollView style={styles.book} contentContainerStyle={{ paddingBottom: 20 }}>
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
              {book.publishedData ? moment(book.publishedDate).format('LL') : 'Unknown'}
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
    backgroundColor: COLORS.primary200,
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
    backgroundColor: COLORS.primary100,
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
    fontSize: 15,
    fontStyle: 'italic',
  },
  author: {
    fontFamily: 'Heebo-Bold',
    color: COLORS.primary600,
    fontSize: 16,
    marginTop: 5,
  },
  ratingContainer: {
    marginTop: 20,
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
})
