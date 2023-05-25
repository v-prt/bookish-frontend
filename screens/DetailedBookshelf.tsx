import { FC, useEffect, useState, useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Keyboard,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { DetailedBookCard } from '../components/DetailedBookCard'
import { COLORS } from '../GlobalStyles'
import { Book } from '../Interfaces'
import { Input } from '../ui/Input'
import { Formik } from 'formik'
import * as yup from 'yup'
import * as Haptics from 'expo-haptics'

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
  const [totalBooks, setTotalBooks] = useState<number | undefined>(undefined)
  const [books, setBooks] = useState<Book[]>([])
  const [formData, setFormData] = useState<any>({ bookshelf: bookshelf.title })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    [bookshelf.id, userId, bookshelf.title, formData],
    async ({ pageParam }) => {
      const { data } = await axios.get(`${API_URL}/bookshelf/${userId}/${pageParam || 1}`, {
        params: formData,
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

  const initialValues = {
    search: '',
  }

  const validationSchema = yup.object().shape({
    search: yup.string().trim(), // no whitespace
  })

  const handleSearch = ({ search }: { search: string }) => {
    setFormData({ ...formData, search })
  }

  return (
    <View style={styles.screen}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSearch}>
        {({ handleChange, handleBlur, handleSubmit, values, setValues }) => (
          <View style={styles.searchHeader}>
            <Input
              config={{
                // submit form on change
                onChangeText: handleChange('search'),
                onBlur: () => {
                  Keyboard.dismiss()
                  handleBlur('search')
                },
                onSubmitEditing: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
                  handleSubmit()
                },
                keyboardType: 'web-search', // ios only
                value: values.search,
                placeholder: 'Search bookshelf',
              }}
              icon={values.search.length > 0 ? 'close' : 'search'}
              onIconPress={() => {
                if (values.search.length > 0) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  handleChange('search')('')
                  handleSubmit()
                }
              }}
            />
          </View>
        )}
      </Formik>

      {/* FIXME: border radius overflow visible */}
      <View style={styles.screenInner}>
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
              <Text style={styles.infoText}>No books.</Text>
            </View>
          ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    flex: 1,
  },
  screenInner: {
    backgroundColor: COLORS.primary100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
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
