import { FC, useContext, useState, useEffect } from 'react'
import { ScrollView, Pressable, View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { useInfiniteQuery } from 'react-query'
import { SimpleBookList } from './SimpleBookList'
import { COLORS } from '../GlobalStyles'
import { MaterialIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import axios from 'axios'
import { API_URL } from '../constants'

interface Props {
  bookshelf: {
    title: string
    id: string
  }
  navigation: any
}

export const SimpleBookshelf: FC<Props> = ({ bookshelf, navigation }) => {
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
    <>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>{bookshelf.title}</Text>
        {status === 'success' && data ? (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              navigation.navigate('DetailedBookshelf', { bookshelf })
            }}
            style={({ pressed }) => [
              styles.bookshelfBtn,
              pressed && styles.pressed,
              !totalBooks && styles.disabled,
            ]}
            disabled={!totalBooks}>
            <Text style={styles.totalResults}>
              {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
            </Text>
            {!!totalBooks && (
              <MaterialIcons name='chevron-right' size={20} color={COLORS.accentLight} />
            )}
          </Pressable>
        ) : (
          <ActivityIndicator size='small' color={COLORS.primary400} />
        )}
      </View>

      {status === 'loading' && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.loading}>
          {[...Array(6)].map((_, i) => (
            <View style={[styles.skelement, i === 5 && { marginRight: 20 }]} key={i} />
          ))}
        </ScrollView>
      )}
      {status === 'success' &&
        (totalBooks && books?.length ? (
          <SimpleBookList
            books={books}
            infiniteScroll={handleInfiniteScroll}
            isLoading={isFetchingNextPage}
          />
        ) : (
          <View style={styles.emptyView}>
            <View style={styles.skelement}>
              <Text style={styles.emptyText}>-</Text>
              <Text style={styles.emptyText}>None</Text>
              <Text style={styles.emptyText}>-</Text>
            </View>
          </View>
        ))}
    </>
  )
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.primary400,
    borderBottomWidth: 1,
    marginLeft: 20,
    marginBottom: 20,
    paddingRight: 20,
    paddingBottom: 8,
  },
  headerText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 18,
    color: COLORS.primary900,
  },
  loading: {
    gap: 10,
    marginBottom: 25,
  },
  skelement: {
    // TODO: add shine animation for background color
    height: 170,
    aspectRatio: 2 / 3,
    backgroundColor: COLORS.primary200,
    borderRadius: 10,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyView: {
    height: 170,
    marginBottom: 25,
  },
  emptyText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.grey,
  },
  bookshelfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
  totalResults: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.accentLight,
    marginLeft: 10,
  },
})
