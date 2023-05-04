import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Pressable,
} from 'react-native'
import { useQuery } from 'react-query'
import { COLORS } from '../GlobalStyles'
// import HTMLView from 'react-native-htmlview'
import { MaterialIcons } from '@expo/vector-icons'
import { ImageLoader } from '../components/ImageLoader'

export const BookDetails = ({
  route: {
    params: { id },
  },
}: any) => {
  const [book, setBook] = useState<any>(null)
  const [bookDescription, setBookDescription] = useState<string>('')
  const [expandDescription, setExpandDescription] = useState<boolean>(false)

  const { data, status } = useQuery(['book', id], () =>
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`).then(res => res.json())
  )

  useEffect(() => {
    if (data) {
      setBook(data.volumeInfo)
    }
  })

  const parseDescription = (description: string) => {
    const regex = /(<([^>]+)>)/gi
    return description.replace(regex, '')
  }

  // useEffect(() => {
  //   if (book?.description) {
  //     setBookDescription(
  //       book.description
  //         // replace <br> tags with line breaks
  //         ?.replace(/<br\s*\/?>/gi, '\n')
  //         // remove excess whitespace
  //         .replace(/\s+/g, ' ')
  //     )
  //   }
  // })

  return (
    <View style={styles.screen}>
      {(status === 'loading' || !book) && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary300} />
        </View>
      )}

      {status === 'success' && book && (
        <ScrollView style={styles.book} contentContainerStyle={{ paddingBottom: 40 }}>
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
            {expandDescription ? (
              <Text style={styles.description}>{parseDescription(book.description)}</Text>
            ) : (
              <View style={styles.descriptionCollapsed}>
                <Text style={styles.description} numberOfLines={5}>
                  {parseDescription(book.description)}
                </Text>
                <Pressable onPress={() => setExpandDescription(true)}>
                  <Text style={styles.readMoreText}>Read More</Text>
                </Pressable>
              </View>
            )}
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
    color: COLORS.primary900,
    fontFamily: 'Prata-Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.primary700,
    fontSize: 14,
    fontStyle: 'italic',
  },
  author: {
    color: COLORS.primary500,
    fontSize: 16,
    marginTop: 10,
  },
  ratingContainer: {
    marginTop: 15,
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
  description: {
    fontSize: 16,
  },
  descriptionCollapsed: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  readMoreText: {
    color: COLORS.primary500,
    fontFamily: 'Heebo-Bold',
    fontSize: 14,
  },
})
