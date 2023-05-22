import { FC, useEffect, useContext } from 'react'
import { useQuery } from 'react-query'
import { StyleSheet, FlatList, View, Text, ActivityIndicator } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { BookContext } from '../contexts/BookContext'
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
  const { fetchBookshelf } = useContext(BookContext)

  const { data, status } = useQuery(bookshelf.id, () => fetchBookshelf(userId, bookshelf.title))

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

  return (
    <View style={styles.screen}>
      {/* TODO: pagination, search */}
      {status === 'loading' && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary400} />
        </View>
      )}
      {status === 'success' &&
        (data?.books?.length ? (
          <FlatList
            style={styles.list}
            data={data.books}
            keyExtractor={book => book?.volumeId}
            renderItem={({ item }) => (item ? <DetailedBookCard book={item} /> : null)}
            contentContainerStyle={{ paddingBottom: 20 }}
            // onEndReachedThreshold={0.2}
            // onEndReached={infiniteScroll}
            keyboardDismissMode='on-drag'
            // show loading indicator at bottom when fetching more books
            // ListFooterComponent={() => {
            //   if (isLoading) {
            //     return (
            //       <View style={styles.footerContainer}>
            //         <ActivityIndicator size='small' color={COLORS.primary400} />
            //       </View>
            //     )
            //   } else {
            //     return null
            //   }
            // }}
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
