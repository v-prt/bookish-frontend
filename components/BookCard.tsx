import { StyleSheet, View, Text, Image } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { Book } from '../types'

interface Props {
  book: Book
}

export const BookCard: React.FC<Props> = ({ book }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: book.image }} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author || 'Unknown Author'}</Text>
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
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    height: 100,
    width: 75,
  },
  textContainer: {
    maxWidth: '70%',
    marginLeft: 10,
  },
  title: {
    color: COLORS.accentDark,
    fontSize: 16,
  },
  author: {
    color: COLORS.grey,
    fontSize: 14,
  },
})
