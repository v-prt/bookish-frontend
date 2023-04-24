import { StyleSheet, View, Text, ActivityIndicator, Keyboard, ScrollView } from 'react-native'
import { useInfiniteQuery } from 'react-query'
import { COLORS } from '../GlobalStyles'
import { BookList } from '../components/BookList'
import { Input } from '../ui/Input'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik } from 'formik'
import { sanitizeText } from '../utils'
import { IconButton } from '../ui/IconButton'
import { GenreButton } from '../components/GenreButton'

interface Props {}

export const Search: React.FC<Props> = ({}) => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [totalResults, setTotalResults] = useState<number | null>(null)

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['books', searchText],
    async ({ pageParam = 0 }) => {
      if (searchText?.length > 0) {
        const maxResults = 20

        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${searchText}&startIndex=${pageParam}&maxResults=${maxResults}`
        )

        const items = res.data.items
        const totalItems = res.data.totalItems
        return { items, totalItems }
      } else return { items: [], totalItems: 0 }
    },
    {
      getNextPageParam: (lastPage, pages) => {
        const maxResults = 20
        const currentCount = pages.flatMap(page => page?.items).length
        return currentCount < lastPage?.totalItems ? currentCount + maxResults : undefined
      },
    }
  )

  const filterBooks = (pages: any[]) => {
    // remove duplicates and books without images
    const books = pages.flatMap(page => page?.items || [])
    const uniqueBooks = Array.from(new Set(books.map((book: any) => book.id))).map(id => {
      const filteredBooks = books.filter(book => book.id === id)
      const book = filteredBooks[0]
      return {
        id: book.id,
        title: book.volumeInfo.title,
        image: book.volumeInfo.imageLinks?.thumbnail,
        author: book.volumeInfo.authors?.[0],
      }
    })
    const booksWithImages = uniqueBooks.filter((book: any) => book.image !== undefined)
    return booksWithImages
  }

  useEffect(() => {
    if (status === 'success' && data) {
      const searchResults = filterBooks(data.pages)
      setSearchResults(searchResults)
      setTotalResults(data.pages[0]?.totalItems)
    }
  }, [status, data])

  const handleLoadMore = () => {
    fetchNextPage()
  }

  const handleSearch = (text: string) => {
    const sanitizedText = sanitizeText(text)
    setSearchText(sanitizedText)
  }

  const genres = [
    'Fiction',
    'Nonfiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Thriller',
    'Young Adult',
  ]

  return (
    <View style={styles.screen}>
      <Formik
        initialValues={{ search: '' }}
        onSubmit={values => {
          handleSearch(values.search)
          // reset search results
          setSearchResults(null)
          setTotalResults(null)
        }}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.searchBar}>
            <Input
              config={{
                // submit form on change
                onChangeText: handleChange('search'),
                onBlur: () => {
                  Keyboard.dismiss()
                  handleBlur('search')
                },
                // FIXME: typescript error
                onSubmitEditing: handleSubmit,
                keyboardType: 'web-search', // ios only
                value: values.search || searchText,
                placeholder: 'Search books',
              }}
              icon={values.search.length > 0 || searchText.length > 0 ? 'close' : 'search'}
              onIconPress={() => {
                if (values.search.length > 0 || searchText.length > 0) {
                  handleChange('search')('')
                  setSearchText('')
                  setSearchResults(null)
                  setTotalResults(null)
                }
              }}
            />
            {/* TODO: animate button to appear when input is focused */}
            <IconButton icon='arrow-forward' color={COLORS.accentLight} onPress={handleSubmit} />
          </View>
        )}
      </Formik>

      {status === 'loading' && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary300} />
        </View>
      )}

      {status === 'success' &&
        (searchResults?.length > 0 ? (
          <>
            <Text style={styles.text}>Total Results: {totalResults}</Text>
            <BookList
              books={searchResults}
              infiniteScroll={handleLoadMore}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : searchText?.length > 0 ? (
          <View style={styles.loading}>
            <Text style={styles.text}>No Results</Text>
          </View>
        ) : (
          <ScrollView keyboardDismissMode='on-drag'>
            <View style={styles.genres}>
              {genres.map(genre => (
                <GenreButton key={genre} genre={genre} onPress={() => handleSearch(genre)} />
              ))}
            </View>
          </ScrollView>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  genres: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    margin: 10,
  },
  text: {
    fontSize: 12,
    color: COLORS.grey,
    textAlign: 'center',
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
})
