import { FC, useContext, useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { Avatar } from '../ui/Avatar'
import moment from 'moment'
import axios from 'axios'
import { IconButton } from '../ui/IconButton'

interface Props {
  navigation: any
}

export const Profile: FC<Props> = ({ navigation }) => {
  const { userData } = useContext(UserContext)
  const books = userData.books
  const numOwned = books?.filter((book: any) => book.owned).length
  const numWantToRead = books?.filter((book: any) => book.bookshelf === 'Want to read').length
  const numRead = books?.filter((book: any) => book.bookshelf === 'Read').length
  const [currentlyReading, setCurrentlyReading] = useState<any>(null)

  const setBooksReading = async (books: any[]) => {
    const data = await Promise.all(
      books.map(async book => {
        const { data } = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${book.volumeId}`
        )
        return {
          title: data.volumeInfo.title,
          image: data.volumeInfo.imageLinks?.thumbnail,
          author: data.volumeInfo.authors?.[0],
          averageRating: data.volumeInfo.averageRating,
          ratingsCount: data.volumeInfo.ratingsCount,
          ...book,
        }
      })
    )
    setCurrentlyReading(data)
  }

  useEffect(() => {
    const reading = books?.filter((book: any) => book.bookshelf === 'Currently reading')

    if (reading.length) {
      setBooksReading(reading)
    }
  }, [userData])

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.basicInfo}>
        <Avatar initials={`${userData.firstName[0]}${userData.lastName[0]}`} />
        <View>
          <Text style={styles.name}>
            {userData.firstName} {userData.lastName}
          </Text>
          <Text style={styles.dateJoined}>Joined {moment(userData.joined).format('ll')}</Text>
        </View>
        <View style={styles.settingsBtn}>
          <IconButton
            icon='settings'
            color={COLORS.primary600}
            onPress={() => {
              navigation.navigate('Settings')
            }}
          />
        </View>
      </View>
      {/* TODO: ratings, reading activity, etc. ? */}
      <View style={styles.profileWrapper}>
        <Text style={styles.headerText}>Books</Text>
        <View style={styles.divider} />
        <View style={styles.bookshelvesContainer}>
          {!!currentlyReading?.length && (
            <Text style={styles.currentlyReadingText}>
              Currently reading{' '}
              <Text style={styles.currentlyReadingTitle}>"{currentlyReading?.[0].title}"</Text>{' '}
              {currentlyReading?.length > 1 && `+ ${currentlyReading.length - 1} more`}
            </Text>
          )}

          <View style={styles.bookshelfWrapper}>
            <Text style={styles.bookshelfLabel}>Owned</Text>
            <Text style={styles.bookshelfCount}>{numOwned}</Text>
          </View>
          <View style={styles.bookshelfWrapper}>
            <Text style={styles.bookshelfLabel}>Want to read</Text>
            <Text style={styles.bookshelfCount}>{numWantToRead}</Text>
          </View>
          <View style={styles.bookshelfWrapper}>
            <Text style={styles.bookshelfLabel}>Read</Text>
            <Text style={styles.bookshelfCount}>{numRead}</Text>
          </View>
        </View>

        <Text style={styles.headerText}>Favorite genres</Text>
        <View style={styles.divider} />
        {userData?.faveGenres?.length > 0 ? (
          <View style={styles.genresContainer}>
            {userData.faveGenres.map((genre: string, i: number) => (
              <View style={styles.genreWrapper} key={i}>
                <Text style={styles.genreLabel}>{genre}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.infoText}>None selected.</Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    flex: 1,
  },
  basicInfo: {
    backgroundColor: COLORS.primary300,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary300,
    gap: 12,
  },
  name: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 18,
    color: COLORS.accentLight,
  },
  dateJoined: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
    color: COLORS.grey,
  },
  settingsBtn: {
    marginLeft: 'auto',
  },
  profileWrapper: {
    backgroundColor: COLORS.primary100,
    padding: 20,
    minHeight: '100%',
  },
  headerText: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
    marginBottom: 8,
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.accentDark,
    marginBottom: 20,
    opacity: 0.6,
  },
  currentlyReadingText: {
    fontFamily: 'RobotoMono-Italic',
    fontSize: 16,
    color: COLORS.grey,
    marginBottom: 20,
  },
  currentlyReadingTitle: {
    color: COLORS.accentDark,
  },
  bookshelvesContainer: {
    marginBottom: 20,
  },
  bookshelfWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary200,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  bookshelfLabel: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.primary900,
  },
  bookshelfCount: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.accentDark,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genreWrapper: {
    backgroundColor: COLORS.primary200,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  genreLabel: {
    color: COLORS.primary800,
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
  },
  infoText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.grey,
  },
})
