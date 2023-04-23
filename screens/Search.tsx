import { StyleSheet, View, Text } from 'react-native'
import { useQuery } from 'react-query'
import { COLORS } from '../GlobalStyles'
import { BookList } from '../components/BookList'
import { Input } from '../ui/Input'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik } from 'formik'

interface Props {}

export const Search: React.FC<Props> = ({}) => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[] | null>(null)

  const { data, status } = useQuery(['books', searchText], async () => {
    if (searchText?.length > 0) {
      // TODO: pagination using startIndex & maxResults (20), search by genre
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchText}+inauthor:${searchText}`
      )
      return res.data.items
    } else return null
  })

  useEffect(() => {
    if (data) {
      setSearchResults(
        data.map((book: any) => {
          return {
            id: book.id,
            title: book.volumeInfo.title,
            image: book.volumeInfo.imageLinks?.thumbnail,
            author: book.volumeInfo.authors?.[0],
          }
        })
      )
    }
  }, [data])

  return (
    <View style={styles.screen}>
      <View style={styles.searchBar}>
        <Formik
          initialValues={{ search: '' }}
          onSubmit={values => {
            setSearchText(values.search)
          }}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            // TODO: add cancel/search buttons?
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
      {/* TODO: loading state, empty state, error state */}
      {status === 'success' && searchResults && <BookList books={searchResults} />}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary,
    flex: 1,
  },
  text: {
    fontSize: 30,
  },
  searchBar: {
    margin: 10,
  },
})
