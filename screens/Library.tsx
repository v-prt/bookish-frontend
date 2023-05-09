import { FC } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { Bookshelf } from '../components/Bookshelf'

export const Library: FC = () => {
  const bookshelves = [
    { title: 'Currently reading', id: 'currently-reading' },
    { title: 'Want to read', id: 'want-to-read' },
    { title: 'Read', id: 'read' },
  ]

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingBottom: 20,
      }}>
      {bookshelves.map((bookshelf: { title: string; id: string }, i: number) => (
        <Bookshelf bookshelf={bookshelf} key={i} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
    paddingVertical: 20,
  },
})
