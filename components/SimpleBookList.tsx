import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native'
import { SimpleBookCard } from './SimpleBookCard'
import { Book } from '../Interfaces'
import { COLORS } from '../GlobalStyles'

interface Props {
  books: Book[]
  infiniteScroll?: () => void
  isLoading?: boolean
}

export const SimpleBookList: React.FC<Props> = ({ books, infiniteScroll, isLoading }) => {
  return (
    <FlatList
      data={books}
      keyExtractor={book => book.volumeId}
      renderItem={({ item }) => (
        <SimpleBookCard book={item} lastChild={books.indexOf(item) === books.length - 1} />
      )}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      onEndReachedThreshold={0.2}
      onEndReached={infiniteScroll}
      style={styles.wrapper}
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
  wrapper: {
    gap: 10,
    marginBottom: 25,
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingRight: 30,
    flex: 1,
  },
})
