import { StyleSheet, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { BookList } from '../components/BookList'
import { recommendedBooks } from '../data/dummyData'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  return (
    <View style={styles.screen}>
      {/* TODO: design & styling, set recommended books based on user data, overview/stats, genre search buttons? */}
      <Text style={styles.text}>Recommended for you</Text>
      <BookList books={recommendedBooks} />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
  },
  text: {
    fontSize: 30,
  },
})
