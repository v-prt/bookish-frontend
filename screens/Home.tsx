import { StyleSheet, View } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { BookList } from '../components/BookList'
import { recommendedBooks } from '../data/dummyData'
import { SansSerifText } from '../ui/SansSerifText'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  return (
    <View style={styles.screen}>
      {/* TODO: design & styling, set recommended books based on user data, overview/stats, genre search buttons? */}
      <SansSerifText style={styles.text} bold>
        Recommended for you
      </SansSerifText>
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
    fontSize: 20,
    margin: 10,
  },
})
