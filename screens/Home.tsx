import { FC, useContext, useState } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { RecommendedBooks } from '../components/RecommendedBooks'
import { CustomButton } from '../ui/CustomButton'
import { DynamicHeader } from '../components/DynamicHeader'

interface Props {
  navigation: any
}

export const Home: FC<Props> = ({ navigation }) => {
  const { userData } = useContext(UserContext)
  const faveGenres = userData?.faveGenres
  const [scrolledPastTop, setScrolledPastTop] = useState(false)

  // animate header based on scroll position
  const handleScroll = (e: any) => {
    if (e.nativeEvent.contentOffset.y > 20) {
      setScrolledPastTop(true)
    } else {
      setScrolledPastTop(false)
    }
  }

  return (
    <View style={styles.screen}>
      {/* FIXME: improve animation performance or adjust functionality (slightly jarring when scrolling back up) */}
      <DynamicHeader scrolledPastTop={scrolledPastTop} />

      <ScrollView
        style={styles.screenInner}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={
          16 /* 16ms is the default value for RN ScrollView, which is 60fps (1000ms / 60fps = 16ms) */
        }>
        <View style={styles.btnWrapper}>
          <CustomButton
            type='primary'
            label='Search Books'
            icon='search'
            onPress={() => navigation.navigate('Search')}
          />
        </View>
        <Text style={styles.headerText}>Recommended for you</Text>
        <View style={styles.divider} />
        {faveGenres?.length > 0 ? (
          faveGenres.map((genre: string, i: number) => (
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
        {/* TODO: reading activity / stats, genre search buttons */}
        <Text style={styles.headerText}>Your reading activity</Text>
        <View style={styles.divider} />

        <Text style={styles.headerText}>Explore by genre</Text>
        <View style={styles.divider} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    flex: 1,
  },
  screenInner: {
    backgroundColor: COLORS.white,
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
