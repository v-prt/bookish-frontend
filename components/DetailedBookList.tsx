import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native'
import { DetailedBookCard } from './DetailedBookCard'
import { Book } from '../Interfaces'
import { COLORS } from '../GlobalStyles'

interface Props {
  books: Book[]
  infiniteScroll: () => void
  isLoading: boolean
}

export const DetailedBookList: React.FC<Props> = ({ books, infiniteScroll, isLoading }) => {
  // remove any duplicate books (issue with Google Books API)
  const uniqueBooks =
    // create array of unique volumeIds
    Array.from(new Set(books.map(book => book.volumeId))).map(volumeId => {
      // find first instance of book with matching volumeId
      return books.find(book => book.volumeId === volumeId)
    })

  // ignore books without images
  const booksWithImages = uniqueBooks.filter((book: any) => book.image !== undefined)

  const generateKey = () => {
    // generate random number between 1 and 1000000
    const randomNum = Math.floor(Math.random() * 1000000) + 1
    return randomNum.toString()
  }

  return (
    <FlatList
      data={booksWithImages}
      keyExtractor={book => book?.volumeId || generateKey()}
      renderItem={({ item }) => (item ? <DetailedBookCard book={item} /> : null)}
      contentContainerStyle={{ paddingBottom: 20 }}
      onEndReachedThreshold={0.2}
      onEndReached={infiniteScroll}
      keyboardDismissMode='on-drag'
      style={styles.list}
      // show loading indicator at bottom when fetching more books
      ListFooterComponent={() => {
        if (isLoading) {
          return (
            <View style={styles.footerContainer}>
              <ActivityIndicator size='small' color={COLORS.primary400} />
            </View>
          )
        } else {
          return null
        }
      }}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
  footerContainer: {
    padding: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
})
