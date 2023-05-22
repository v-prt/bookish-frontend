import { FC } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { SimpleBookshelf } from '../components/SimpleBookshelf'

interface Props {
  navigation: any
}

export const Library: FC<Props> = ({ navigation }) => {
  const bookshelves = [
    { title: 'Currently reading', id: 'currently-reading' },
    { title: 'Want to read', id: 'want-to-read' },
    { title: 'Read', id: 'read' },
  ]

  return (
    <View style={styles.screen}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>My Library</Text>
      </View>

      <View style={styles.screenInnerWrapper}>
        <ScrollView style={styles.screenInner}>
          {bookshelves.map((bookshelf: { title: string; id: string }, i: number) => (
            <SimpleBookshelf bookshelf={bookshelf} key={i} navigation={navigation} />
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: COLORS.primary300,
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
  },
  headerText: {
    fontFamily: 'RobotoMono-Bold',
    color: COLORS.accentDark,
    fontSize: 20,
  },
  screenInnerWrapper: {
    backgroundColor: COLORS.primary100,
    // android shadow
    elevation: 4,
    // ios shadow
    shadowColor: COLORS.primary700,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  screenInner: {
    paddingVertical: 20,
  },
})
