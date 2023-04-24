import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native'
import { BookCard } from './BookCard'
import { Book } from '../types'
import { COLORS } from '../GlobalStyles'

interface Props {
  books: Book[]
  infiniteScroll: () => void
  isLoading: boolean
}

export const BookList: React.FC<Props> = ({ books, infiniteScroll, isLoading }) => {
  return (
    <FlatList
      data={books}
      keyExtractor={book => book.id}
      renderItem={({ item }) => <BookCard book={item} />}
      contentContainerStyle={{ paddingBottom: 10 }}
      onEndReachedThreshold={0.5}
      onEndReached={infiniteScroll}
      keyboardDismissMode='on-drag'
      // show loading indicator at bottom when fetching more books
      ListFooterComponent={() => {
        if (isLoading) {
          return (
            <View style={styles.footerContainer}>
              <ActivityIndicator size='small' color={COLORS.primary300} />
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
  footerContainer: {
    padding: 10,
    alignItems: 'center',
  },
})
