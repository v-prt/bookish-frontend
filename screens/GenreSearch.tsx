import { FC, useState, useContext, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { DetailedBookList } from '../components/DetailedBookList'
import { SearchContext } from '../contexts/SearchContext'
import { styles } from './Search'
import { quotes } from '../data/quotes'

interface Props {
  navigation: any
}

export const GenreSearch: FC<Props> = ({ navigation }) => {
  const {
    selectedGenre,
    genreSearchResults,
    genreSearchStatus,
    handleLoadMoreGenreResults,
    isFetchingNextGenreSearchPage,
  } = useContext(SearchContext)
  const [quote, setQuote] = useState<string>('')

  useEffect(() => {
    navigation.setOptions({
      title: selectedGenre,
      headerTitle: () => (
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'RobotoMono-Bold',
            color: COLORS.primary700,
          }}>
          {selectedGenre}
        </Text>
      ),
    })

    // clean selected genre string to match key in quotes object
    setQuote(quotes[selectedGenre.toLowerCase().replace('-', '')])
  }, [])

  return (
    <View style={styles.screen}>
      <View style={styles.headerWrapper}>
        <Text style={styles.quote}>{quote}</Text>
      </View>

      {genreSearchStatus === 'loading' && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary300} />
        </View>
      )}

      {genreSearchStatus === 'success' &&
        (genreSearchResults?.length > 0 ? (
          <>
            <DetailedBookList
              books={genreSearchResults}
              infiniteScroll={handleLoadMoreGenreResults}
              isLoading={isFetchingNextGenreSearchPage}
            />
          </>
        ) : (
          <View style={styles.loading}>
            <Text style={styles.text}>No Results</Text>
          </View>
        ))}
    </View>
  )
}
