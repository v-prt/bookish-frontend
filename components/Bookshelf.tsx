import { FC, useContext } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { BookContext } from '../contexts/BookContext'
import { useQuery } from 'react-query'
import { SimpleBookList } from '../components/SimpleBookList'
import { COLORS } from '../GlobalStyles'

interface Props {
  bookshelf: {
    title: string
    id: string
  }
}

export const Bookshelf: FC<Props> = ({ bookshelf }) => {
  const { userId } = useContext(UserContext)
  const { fetchBookshelf } = useContext(BookContext)

  const { data, status } = useQuery(bookshelf.id, () => fetchBookshelf(userId, bookshelf.title))

  return (
    <View>
      <Text style={styles.headerText}>{bookshelf.title}</Text>
      <View style={styles.divider} />
      {status === 'loading' && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.loading}>
          {[...Array(6)].map((_, i) => (
            <View style={[styles.skelement, i === 5 && { marginRight: 20 }]} key={i} />
          ))}
        </ScrollView>
      )}
      {status === 'success' &&
        (data?.books?.length ? (
          <SimpleBookList books={data.books} />
        ) : (
          <Text style={styles.infoText}>No books in this shelf.</Text>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
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
