import { FlatList } from 'react-native'
import { BookCard } from './BookCard'
import { Book } from '../types'

interface Props {
  books: Book[]
}

export const BookList: React.FC<Props> = ({ books }) => {
  return (
    <FlatList
      data={books}
      keyExtractor={book => book.id}
      renderItem={({ item }) => <BookCard book={item} />}
    />
  )
}
