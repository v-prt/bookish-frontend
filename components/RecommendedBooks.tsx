import { FC, useContext } from 'react'
import { useQuery } from 'react-query'
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native'
import { SimpleBookList } from '../components/SimpleBookList'
import { COLORS } from '../GlobalStyles'
import * as Haptics from 'expo-haptics'
import { MaterialIcons } from '@expo/vector-icons'
import { SearchContext } from '../contexts/SearchContext'
import { UserContext } from '../contexts/UserContext'

interface Props {
  genre: string
  navigation: any
}

export const RecommendedBooks: FC<Props> = ({ genre, navigation }) => {
  const { setGenreSearchText, setSelectedGenre } = useContext(SearchContext)
  const { fetchRecommendedBooks } = useContext(UserContext)

  const { data, status } = useQuery(['recommended-books', genre], () =>
    fetchRecommendedBooks(genre)
  )

  const handleGenreSearch = (genre: string) => {
    setGenreSearchText(`highly rated ${genre} books`)
    setSelectedGenre(genre)
    navigation.navigate('GenreSearch')
  }

  return (
    <View>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>{genre}</Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            handleGenreSearch(genre)
          }}
          style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}>
          <Text style={styles.linkBtnText}>All</Text>
          <MaterialIcons name='chevron-right' size={20} color={COLORS.accentLight} />
        </Pressable>
      </View>
      {status === 'loading' && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.loading}>
          {[...Array(6)].map((_, i) => (
            <View
              style={[
                styles.skelement,
                // if last child, add marginRight
                i === 5 && { marginRight: 20 },
              ]}
              key={i}
            />
          ))}
        </ScrollView>
      )}
      {/* FIXME: encountering children with the same key error (horror genre) */}
      {status === 'success' && data && <SimpleBookList books={data.recommendedBooks} />}
    </View>
  )
}

const styles = StyleSheet.create({
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
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 18,
    color: COLORS.primary900,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  pressed: {
    opacity: 0.6,
  },
  linkBtnText: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.accentLight,
    marginLeft: 10,
  },
})
