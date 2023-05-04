import { StyleSheet, ScrollView } from 'react-native'
import { SimpleBookCard } from './SimpleBookCard'
import { Book } from '../Interfaces'
import { COLORS } from '../GlobalStyles'

interface Props {
  books: Book[]
}

export const SimpleBookList: React.FC<Props> = ({ books }) => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.wrapper}>
      {books.map(book => (
        <SimpleBookCard
          key={book.id}
          book={book}
          // if book is last in list, pass true to lastChild prop to add margin to right side
          lastChild={book.id === books[books.length - 1].id ? true : false}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
    marginBottom: 25,
  },
})
