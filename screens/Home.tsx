import { StyleSheet, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { BookList } from '../components/BookList'

export const Home: React.FC = () => {
  return (
    <View style={styles.screen}>
      {/* TODO: design & styling, set recommended books based on user data, overview/stats, genre search buttons? */}
      <Text style={styles.headerText}>Recommended for You</Text>
      {/* <BookList books={recommendedBooks} /> */}
      <Text style={styles.headerText}>Your Reading Activity</Text>
      <Text style={styles.headerText}>Explore by Genre</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
    marginBottom: 16,
    color: COLORS.accentDark,
  },
})
