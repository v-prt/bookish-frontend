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
          id: book.id,
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
              key={i}></View>
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
    height: 150,
    aspectRatio: 2 / 3,
    backgroundColor: COLORS.primary200,
    borderRadius: 5,
    marginLeft: 20,
  },
  label: {
    color: COLORS.primary900,
    fontSize: 18,
    fontFamily: 'Prata-Regular',
    marginHorizontal: 20,
    marginBottom: 20,
  },
})
