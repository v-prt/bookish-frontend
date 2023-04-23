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
        <Text style={styles.author}>{book.author}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    flexDirection: 'row',
    margin: 10,
    padding: 10,
  },
  image: {
    borderRadius: 10,
    height: 100,
    width: 75,
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
  },
  author: {
    color: COLORS.grey,
    fontSize: 16,
  },
})
