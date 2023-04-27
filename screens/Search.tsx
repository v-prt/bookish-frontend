import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from 'react-native'
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

// genre images
const adventure = require('../assets/images/adventure.jpg')
const comics = require('../assets/images/comics.jpg')
const fantasy = require('../assets/images/fantasy.jpg')
const fiction = require('../assets/images/fiction.jpg')
const history = require('../assets/images/history.jpg')
const horror = require('../assets/images/horror.jpg')
const kids = require('../assets/images/kids.jpg')
const mystery = require('../assets/images/mystery.jpg')
const nonFiction = require('../assets/images/nonfiction.jpg')
const poetry = require('../assets/images/poetry.jpg')
const romance = require('../assets/images/romance.jpg')
const scienceFiction = require('../assets/images/science-fiction.jpg')
const thriller = require('../assets/images/thriller.jpg')
const youngAdult = require('../assets/images/young-adult.jpg')

interface Props {}

export const Search: React.FC<Props> = ({}) => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [totalResults, setTotalResults] = useState<number | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
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
        averageRating: book.volumeInfo.averageRating,
        ratingsCount: book.volumeInfo.ratingsCount,
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

  const handleGenreSearch = (genre: string) => {
    setSearchText(`highly rated ${genre} books`)
    setSelectedGenre(genre)
  }

  const genres = [
    { label: 'Adventure', image: adventure },
    { label: 'Fantasy', image: fantasy },
    { label: 'Fiction', image: fiction },
    { label: 'Graphic Novels', image: comics },
    { label: 'History', image: history },
    { label: 'Horror', image: horror },
    { label: 'Kids', image: kids },
    { label: 'Mystery', image: mystery },
    { label: 'Non-Fiction', image: nonFiction },
    { label: 'Poetry', image: poetry },
    { label: 'Romance', image: romance },
    { label: 'Science Fiction', image: scienceFiction },
    { label: 'Thriller', image: thriller },
    { label: 'Young Adult', image: youngAdult },
  ]

  return (
    <Formik
      initialValues={{ search: '' }}
      onSubmit={values => {
        handleSearch(values.search)
        // reset search results
        setSearchResults(null)
        setTotalResults(null)
      }}>
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.screen}>
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
                value: values.search,
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
            {/* <IconButton icon='arrow-forward' color={COLORS.accentLight} onPress={handleSubmit} /> */}
          </View>

          {status === 'loading' && (
            <View style={styles.loading}>
              <ActivityIndicator size='large' color={COLORS.primary300} />
            </View>
          )}

          {status === 'success' &&
            (searchResults?.length > 0 ? (
              <>
                <View style={styles.resultsHeader}>
                  <Text style={styles.text}>
                    Total Results: {totalResults?.toLocaleString()}
                    {selectedGenre && ` (${selectedGenre})`}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setSearchText('')
                      handleSubmit()
                    }}>
                    <Text style={styles.resetBtnText}>Reset</Text>
                  </Pressable>
                </View>
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
                    <GenreButton
                      key={genre.label}
                      label={genre.label}
                      image={genre.image}
                      onPress={() => {
                        handleGenreSearch(genre.label)
                      }}
                    />
                  ))}
                </View>
              </ScrollView>
            ))}
        </View>
      )}
    </Formik>
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
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  resetBtnText: {
    fontFamily: 'Heebo-Bold',
    color: COLORS.accentLight,
  },
  text: {
    fontSize: 12,
    color: COLORS.grey,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
})
