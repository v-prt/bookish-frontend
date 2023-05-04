import { useContext } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { RecommendedBooks } from '../components/RecommendedBooks'
import { CustomButton } from '../ui/CustomButton'

interface Props {
  navigation: any
}

export const Home: React.FC<Props> = ({ navigation }) => {
  const { userData } = useContext(UserContext)
  const faveGenres = userData?.faveGenres

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.main}>
        <Text style={styles.headerText}>Recommended for you</Text>
        <View style={styles.divider}></View>
        {faveGenres?.length > 0 ? (
          faveGenres.map((genre: string, index: number) => (
            <RecommendedBooks genre={genre} key={index} />
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
        {/* TODO: reading activity / stats, genre search buttons */}
        <Text style={styles.headerText}>Your reading activity</Text>
        <View style={styles.divider}></View>

        <Text style={styles.headerText}>Explore by genre</Text>
        <View style={styles.divider}></View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
  },
  main: {
    backgroundColor: COLORS.primary100,
  },
  headerText: {
    fontFamily: 'Heebo-Bold',
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
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: COLORS.primary600,
    marginBottom: 16,
  },
  noRecommendations: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
})
