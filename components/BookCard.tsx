import { StyleSheet, View, Text, Image } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { Book } from '../types'
import { SerifText } from '../ui/SerifText'
import { SansSerifText } from '../ui/SansSerifText'

interface Props {
  book: Book
}

export const BookCard: React.FC<Props> = ({ book }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: book.image }} />
      <View style={styles.textContainer}>
        <SerifText style={styles.title}>{book.title}</SerifText>
        <SansSerifText style={styles.author}>by {book.author || 'Unknown Author'}</SansSerifText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  image: {
    backgroundColor: COLORS.primary300,
    borderRadius: 10,
    height: 100,
    width: 75,
  },
  textContainer: {
    maxWidth: '70%',
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
  },
  author: {
    color: COLORS.primary500,
    fontSize: 14,
  },
})
