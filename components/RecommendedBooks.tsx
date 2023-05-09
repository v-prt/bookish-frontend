import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { SimpleBookList } from '../components/SimpleBookList'
import { COLORS } from '../GlobalStyles'
import axios from 'axios'

interface Props {
  genre: string
}

export const RecommendedBooks: React.FC<Props> = ({ genre }) => {
  // TODO: get user's books to compare with results and ignore books they already have in any bookshelf (create endpoint in backend to handle this logic)
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

  return (
    <View>
      <Text style={styles.label}>{genre}</Text>
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
    borderRadius: 5,
    marginLeft: 20,
  },
  label: {
    fontFamily: 'Prata-Regular',
    fontSize: 18,
    color: COLORS.primary900,
    marginHorizontal: 20,
    marginBottom: 20,
  },
})
