import { FC, useContext } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native'
import { COLORS } from '../GlobalStyles'
import { Input } from '../ui/Input'
import * as Haptics from 'expo-haptics'
import { Formik } from 'formik'
import { sanitizeText } from '../utils'
import { GenreButton } from '../components/GenreButton'
import { DetailedBookList } from '../components/DetailedBookList'
import { SearchContext } from '../contexts/SearchContext'

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

export const Search: FC = () => {
  const {
    data,
    status,
    searchText,
    setSearchText,
    selectedGenre,
    setSelectedGenre,
    handleInfiniteScroll,
    isFetchingNextPage,
  } = useContext(SearchContext)

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
    { label: 'Comics', image: comics },
    { label: 'History', image: history },
    { label: 'Horror', image: horror },
    { label: 'Kids', image: kids },
    { label: 'Mystery', image: mystery },
    { label: 'Nonfiction', image: nonFiction },
    { label: 'Poetry', image: poetry },
    { label: 'Romance', image: romance },
    { label: 'Sci-Fi', image: scienceFiction },
    { label: 'Thriller', image: thriller },
    { label: 'Young Adult', image: youngAdult },
  ]

  return (
    <Formik
      initialValues={{ search: '' }}
      onSubmit={values => {
        handleSearch(values.search)
      }}>
      {({ handleChange, handleBlur, handleSubmit, values, setValues }) => (
        <View style={styles.screen}>
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
                  setSelectedGenre(null)
                  handleSubmit()
                },
                keyboardType: 'web-search', // ios only
                value: values.search,
                placeholder: 'Search books',
              }}
              icon={values.search.length > 0 || searchText.length > 0 ? 'close' : 'search'}
              onIconPress={() => {
                if (values.search.length > 0 || searchText.length > 0) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  handleChange('search')('')
                  setSearchText('')
                }
              }}
            />
          </View>

          <View style={styles.screenInner}>
            {status === 'loading' && (
              <View style={styles.loading}>
                <ActivityIndicator size='large' color={COLORS.primary400} />
              </View>
            )}

            {status === 'success' &&
              (data?.pages?.[0]?.totalItems > 0 ? (
                <>
                  <View style={styles.resultsHeader}>
                    <Text style={styles.resultsText}>
                      Total Results: {data?.pages?.[0].totalItems?.toLocaleString()}
                      {selectedGenre && ` (${selectedGenre})`}
                    </Text>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        setValues({ search: '' })
                        setSearchText('')
                        setSelectedGenre(null)
                        handleSubmit()
                      }}>
                      <Text style={styles.resetBtnText}>Reset</Text>
                    </Pressable>
                  </View>
                  <DetailedBookList
                    books={data.pages
                      .map((group: { items: any[] }) => group.items.map((item: any) => item))
                      .flat()}
                    infiniteScroll={handleInfiniteScroll}
                    isLoading={isFetchingNextPage}
                  />
                </>
              ) : searchText?.length > 0 ? (
                <View style={styles.loading}>
                  <Text style={styles.noResults}>No Results</Text>
                </View>
              ) : (
                <ScrollView keyboardDismissMode='on-drag' showsVerticalScrollIndicator={false}>
                  <View style={styles.genres}>
                    {genres.map((genre, i) => (
                      <GenreButton
                        key={i}
                        label={genre.label}
                        image={genre.image}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                          handleGenreSearch(genre.label)
                        }}
                      />
                    ))}
                  </View>
                </ScrollView>
              ))}
          </View>
        </View>
      )}
    </Formik>
  )
}

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    flex: 1,
  },
  screenInner: {
    backgroundColor: COLORS.primary100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,

    // // android shadow
    // elevation: 4,
    // // ios shadow
    // shadowColor: COLORS.primary700,
    // shadowOffset: { width: -2, height: -2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 15,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genres: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: -(20 / 2),
    marginHorizontal: -(20 / 2),
    paddingVertical: 25,
  },
  searchHeader: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary200,
  },
  resetBtnText: {
    fontFamily: 'RobotoMono-Bold',
    color: COLORS.accentLight,
  },
  resultsText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 12,
    color: COLORS.primary800,
  },
  noResults: {
    fontFamily: 'RobotoMono-Medium',
    fontSize: 18,
    color: COLORS.grey,
  },

  // for GenreSearch
  quoteWrapper: {
    backgroundColor: COLORS.primary300,
    padding: 20,
  },
  quote: {
    fontFamily: 'RobotoMono-Italic',
    fontSize: 16,
    color: COLORS.accentDark,
  },
})
