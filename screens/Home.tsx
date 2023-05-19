import { FC, useContext } from 'react'
import { useQuery } from 'react-query'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { RecommendedBooks } from '../components/RecommendedBooks'
import { CustomButton } from '../ui/CustomButton'
import { ReadingActivity } from '../components/ReadingActivity'

interface Props {
  navigation: any
}

export const Home: FC<Props> = ({ navigation }) => {
  const { userData } = useContext(UserContext)
  const faveGenres = userData?.faveGenres

  // pick up to 3 random genres from user's fave genres
  const randomGenres = faveGenres?.sort(() => 0.5 - Math.random()).slice(0, 3)

  // const [scrolledPastTop, setScrolledPastTop] = useState(false)

  // animate header based on scroll position
  // const handleScroll = (e: any) => {
  //   if (e.nativeEvent.contentOffset.y > 20) {
  //     setScrolledPastTop(true)
  //   } else {
  //     setScrolledPastTop(false)
  //   }
  // }

  return (
    <View style={styles.screen}>
      <View style={styles.headerWrapper}>
        <Text style={styles.logo}>
          book
          <Text style={styles.italic}>ish</Text>
        </Text>
      </View>

      <View style={styles.screenInnerWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}>
          <View style={styles.btnWrapper}>
            <CustomButton
              type='primary'
              label='Search Books'
              icon='search'
              onPress={() => navigation.navigate('SearchStack')}
            />
          </View>
          <Text style={styles.headerText}>Recommended for you</Text>
          <View style={styles.divider} />
          {randomGenres?.length > 0 ? (
            randomGenres.map((genre: string, i: number) => (
              <RecommendedBooks genre={genre} key={i} navigation={navigation} />
            ))
          ) : (
            <View style={styles.noRecommendations}>
              <Text style={styles.infoText}>
                Add your favorite genres in your profile to get recommendations for books you might
                like.
              </Text>
              <CustomButton
                type='secondary'
                label='Choose Genres'
                onPress={() => navigation.navigate('ProfileStack')}
              />
            </View>
          )}
          <Text style={styles.headerText}>Your reading activity</Text>
          <View style={styles.divider} />
          <ReadingActivity />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: COLORS.primary300,
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
  },
  logo: {
    color: COLORS.accentDark,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 40,
  },
  italic: {
    fontFamily: 'RobotoMono-Italic',
  },
  screenInnerWrapper: {
    backgroundColor: COLORS.primary100,
    // android shadow
    elevation: 4,
    // ios shadow
    shadowColor: COLORS.primary700,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  btnWrapper: {
    padding: 20,
  },
  headerText: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.accentDark,
    marginLeft: 20,
    marginBottom: 20,
    opacity: 0.6,
  },
  infoText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.primary600,
    marginBottom: 16,
  },
  noRecommendations: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
})
