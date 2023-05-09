import { StyleSheet, ScrollView } from 'react-native'
import { SimpleBookCard } from './SimpleBookCard'
import { Book } from '../Interfaces'

interface Props {
  books: Book[]
}

export const SimpleBookList: React.FC<Props> = ({ books }) => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.wrapper}>
      {books.map((book, i) => (
        <SimpleBookCard
          key={i}
          book={book}
          // if book is last in list, pass true to lastChild prop to add margin to right side
          lastChild={i === books.length - 1}
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
