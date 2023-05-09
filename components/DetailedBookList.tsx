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
  return (
    <FlatList
      data={books}
      keyExtractor={book => book.volumeId}
      renderItem={({ item }) => <DetailedBookCard book={item} />}
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
