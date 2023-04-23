import { FlatList } from 'react-native'
import { BookCard } from './BookCard'
import { Book } from '../types'

interface Props {
  books: Book[]
  infiniteScroll: () => void
}

export const BookList: React.FC<Props> = ({ books, infiniteScroll }) => {
  return (
    <FlatList
      data={books}
      keyExtractor={book => book.id}
      renderItem={({ item }) => <BookCard book={item} />}
      onEndReached={infiniteScroll}
    />
  )
}
