import { StyleSheet, View, Text } from 'react-native'
import { useInfiniteQuery } from 'react-query'
import { COLORS } from '../GlobalStyles'
import { BookList } from '../components/BookList'
import { Input } from '../ui/Input'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik } from 'formik'

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
          `https://www.googleapis.com/books/v1/volumes?q=${searchText}+inauthor:${searchText}&startIndex=${pageParam}&maxResults=${maxResults}`
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

  return (
    <View style={styles.screen}>
      <View style={styles.searchBar}>
        <Formik
          initialValues={{ search: '' }}
          onSubmit={values => {
            setSearchText(values.search)
            // reset search results
            setSearchResults(null)
            setTotalResults(null)
          }}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <Input
              config={{
                // submit form on change
                onChangeText: handleChange('search'),
                onBlur: handleBlur('search'),
                onSubmitEditing: handleSubmit,
                value: values.search,
                placeholder: 'Search books by author, title, or subject',
              }}
            />
          )}
        </Formik>
      </View>
      {status === 'success' && searchResults?.length > 0 && (
        <>
          <Text style={styles.text}>Total Results: {totalResults}</Text>
          <BookList books={searchResults} infiniteScroll={handleLoadMore} />
          {isFetchingNextPage && <Text style={styles.text}>Loading...</Text>}
          {!hasNextPage && <Text style={styles.text}>End of Results</Text>}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary,
    flex: 1,
  },
  text: {
    fontSize: 12,
    color: COLORS.accentDark,
  },
  searchBar: {
    margin: 10,
  },
})
