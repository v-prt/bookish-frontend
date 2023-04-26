import { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image } from 'react-native'
import { useQuery } from 'react-query'
import { COLORS } from '../GlobalStyles'

export const BookDetails = ({
  route: {
    params: { id },
  },
}: any) => {
  console.log(id)
  const [book, setBook] = useState<any>(null)

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

  return (
    <View style={styles.screen}>
      {(status === 'loading' || !book) && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary300} />
        </View>
      )}

      {status === 'success' && book && (
        <ScrollView style={styles.book}>
          <View style={styles.basicInfo}>
            <Image source={{ uri: book.imageLinks?.thumbnail }} style={styles.bookCover} />
            <View style={styles.text}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.subtitle}>{book.subtitle}</Text>
              <Text style={styles.author}>by {book.authors?.join(', ')}</Text>
            </View>
          </View>
          <View style={styles.details}>
            <Text style={styles.description}>{parseDescription(book.description)}</Text>
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
    padding: 20,
  },
  basicInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  text: {
    maxWidth: '70%',
  },
  bookCover: {
    height: 100,
    width: 75,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  details: {},
  author: {
    color: COLORS.primary500,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
  },
})
