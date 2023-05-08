import { FC, useContext } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { useQuery, useInfiniteQuery } from 'react-query'
import { BookContext } from '../contexts/BookContext'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { SimpleBookList } from '../components/SimpleBookList'

export const Library: FC = () => {
  const { fetchBookshelf } = useContext(BookContext)
  const { userId } = useContext(UserContext)

  const { data: currentlyReading, status: currentlyReadingStatus } = useQuery(
    'currently-reading',
    () => fetchBookshelf(userId, 'Currently reading')
  )

  const { data: wantToRead } = useQuery('want-to-read', () =>
    fetchBookshelf(userId, 'Want to read')
  )

  const { data: read } = useQuery('read', () => fetchBookshelf(userId, 'Read'))

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.headerText}>Currently reading</Text>
      <View style={styles.divider} />
      {currentlyReadingStatus === 'loading' && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.loading}>
          {[...Array(6)].map((_, i) => (
            <View style={[styles.skelement, i === 5 && { marginRight: 20 }]} key={i}></View>
          ))}
        </ScrollView>
      )}
      {currentlyReadingStatus === 'success' &&
        (currentlyReading?.books?.length ? (
          <SimpleBookList books={currentlyReading.books} />
        ) : (
          <Text style={styles.infoText}>No books.</Text>
        ))}
      {/* TODO:
      - show number of books in want to read / read bookshelves with link to screen (detailed book list)
      - special styling for "owned" books (mixed bookshelves) */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
  },
  headerText: {
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.accentDark,
    marginLeft: 20,
    marginBottom: 20,
    opacity: 0.6,
  },
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
  infoText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: COLORS.grey,
    marginHorizontal: 20,
  },
})
