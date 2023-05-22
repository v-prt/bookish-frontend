import { FC, useEffect, useState, useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import { StyleSheet, FlatList, View, Text, ActivityIndicator } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { DetailedBookCard } from '../components/DetailedBookCard'
import { COLORS } from '../GlobalStyles'

interface Props {
  route: any
  navigation: any
}

export const DetailedBookshelf: FC<Props> = ({
  route: {
    params: { bookshelf },
  },
  navigation,
}) => {
  const { userId } = useContext(UserContext)
  const [totalBooks, setTotalBooks] = useState(undefined)
  const [books, setBooks] = useState<any[]>([])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    [bookshelf.id, userId, bookshelf.title],
    async ({ pageParam }) => {
      const { data } = await axios.get(`${API_URL}/bookshelf/${userId}/${pageParam || 1}`, {
        params: { bookshelf: bookshelf.title },
      })
      return data
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage?.nextPage,
    }
  )

  useEffect(() => {
    navigation.setOptions({
      title: bookshelf.title,
      headerTitle: () => (
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'RobotoMono-Bold',
            color: COLORS.primary700,
          }}>
          {bookshelf.title}
        </Text>
      ),
    })
  })

  useEffect(() => {
    if (status === 'success' && data) {
      setTotalBooks(data?.pages?.[0]?.totalBooks)
      setBooks(
        data.pages.map((group: { books: any[] }) => group.books.map((book: any) => book)).flat()
      )
    }
  }, [status, data])

  const handleInfiniteScroll = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <View style={styles.screen}>
      {/* TODO: search */}
      {status === 'loading' && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary400} />
        </View>
      )}
      {status === 'success' &&
        (!!totalBooks && books?.length ? (
          <FlatList
            style={styles.list}
            data={books}
            keyExtractor={book => book?.volumeId}
            renderItem={({ item }) => (item ? <DetailedBookCard book={item} /> : null)}
            contentContainerStyle={{ paddingBottom: 20 }}
            onEndReachedThreshold={0.2}
            onEndReached={handleInfiniteScroll}
            keyboardDismissMode='on-drag'
            // show loading indicator at bottom when fetching more books
            ListFooterComponent={() => {
              if (isFetchingNextPage) {
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
        ) : (
          <View style={styles.noBooks}>
            <Text style={styles.infoText}>This shelf is empty.</Text>
          </View>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
  },
  list: {
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBooks: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.primary600,
  },
  footerContainer: {
    padding: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
})
