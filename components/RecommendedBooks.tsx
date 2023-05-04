import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { ScrollView, View, StyleSheet } from 'react-native'
import { SimpleBookList } from '../components/SimpleBookList'
import { COLORS } from '../GlobalStyles'
import axios from 'axios'

interface Props {
  genres: string[]
}

export const RecommendedBooks: React.FC<Props> = ({ genres }) => {
  const [recommendedBooks, setRecommendedBooks] = useState<any>([])

  const fetchRecommendedBooks = async (genres: string[]) => {
    let books = []

    // for each genre, send a request to google books api for 3 books of that genre
    for (let i = 0; i < genres.length; i++) {
      let searchText = `highly rated ${genres[i]} books`
      let pageParam = 0
      let maxResults = 3
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchText}&startIndex=${pageParam}&maxResults=${maxResults}`
      )
      books.push(res.data.items)
    }
    return books.flat()
  }

  const { data, status } = useQuery(['recommendedBooks', genres], () =>
    fetchRecommendedBooks(genres)
  )

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
  },
  skelement: {
    // TODO: add shine animation for background color
    height: 200,
    width: 150,
    backgroundColor: COLORS.primary200,
    borderRadius: 5,
    marginLeft: 20,
  },
})
