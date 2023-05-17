import { FC, useState, useEffect, useContext } from 'react'
import { useQuery } from 'react-query'
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native'
import { SimpleBookList } from '../components/SimpleBookList'
import { COLORS } from '../GlobalStyles'
import axios from 'axios'
import * as Haptics from 'expo-haptics'
import { MaterialIcons } from '@expo/vector-icons'
import { SearchContext } from '../contexts/SearchContext'

interface Props {
  genre: string
  navigation: any
}

export const RecommendedBooks: FC<Props> = ({ genre, navigation }) => {
  // TODO: get user's books to compare with results and ignore books they already have in any bookshelf (create endpoint in backend to handle this logic)
  const { setGenreSearchText, setSelectedGenre } = useContext(SearchContext)
  const [recommendedBooks, setRecommendedBooks] = useState<any>([])

  const fetchRecommendedBooks = async (genre: string) => {
    let searchText = `highly rated ${genre} books`
    let pageParam = 0
    let maxResults = 6

    const res = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchText}&startIndex=${pageParam}&maxResults=${maxResults}`
    )
    return res.data.items
  }

  const { data, status } = useQuery(['recommendedBooks', genre], () => fetchRecommendedBooks(genre))

  useEffect(() => {
    if (status === 'success' && data) {
      const structuredBooks = data.map((book: any) => {
        return {
          volumeId: book.id,
          title: book.volumeInfo.title,
          image: book.volumeInfo.imageLinks?.thumbnail,
          author: book.volumeInfo.authors?.[0],
          averageRating: book.volumeInfo.averageRating,
          ratingsCount: book.volumeInfo.ratingsCount,
        }
      })
      setRecommendedBooks(structuredBooks)
    }
  }, [status, data])

  const handleGenreSearch = (genre: string) => {
    setGenreSearchText(`highly rated ${genre} books`)
    setSelectedGenre(genre)
    navigation.navigate('GenreSearch')
  }

  return (
    <View>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>{genre}</Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            handleGenreSearch(genre)
          }}
          style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}>
          <Text style={styles.linkBtnText}>All</Text>
          <MaterialIcons name='chevron-right' size={20} color={COLORS.accentLight} />
        </Pressable>
      </View>
      {status === 'loading' && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.loading}>
          {[...Array(6)].map((_, i) => (
            <View
              style={[
                styles.skelement,
                // if last child, add marginRight
                i === 5 && { marginRight: 20 },
              ]}
              key={i}
            />
          ))}
        </ScrollView>
      )}
      {status === 'success' && <SimpleBookList books={recommendedBooks} />}
    </View>
  )
}

const styles = StyleSheet.create({
  loading: {
    gap: 10,
    marginBottom: 25,
  },
  skelement: {
    // TODO: add shine animation for background color
    height: 170,
    aspectRatio: 2 / 3,
    backgroundColor: COLORS.primary200,
    borderRadius: 10,
    marginLeft: 20,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 18,
    color: COLORS.primary900,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  pressed: {
    opacity: 0.6,
  },
  linkBtnText: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.accentLight,
    marginLeft: 10,
  },
})
