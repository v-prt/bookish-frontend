import { useContext } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { Avatar } from '../components/Avatar'
import moment from 'moment'

interface Props {
  navigation: any
}

export const Profile: React.FC<Props> = ({ navigation }) => {
  const { userData } = useContext(UserContext)

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
      </View>
      {/* TODO: overview of bookshelves, ratings, reading activity, etc. ? */}
      <View style={styles.profileWrapper}>
        <Text style={styles.headerText}>Favorite Genres</Text>
        <View style={styles.divider}></View>
        {userData?.faveGenres?.length > 0 ? (
          <View style={styles.genresContainer}>
            {userData.faveGenres.map((genre: string, index: number) => (
              <View style={styles.genreWrapper} key={index}>
                <Text key={index} style={styles.genreLabel}>
                  {genre}
                </Text>
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
    backgroundColor: COLORS.primary100,
    flex: 1,
  },
  basicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary300,
    gap: 12,
  },
  name: {
    fontFamily: 'Prata-Regular',
    fontSize: 22,
    color: COLORS.accentLight,
  },
  dateJoined: {
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    color: COLORS.grey,
  },
  profileWrapper: {
    padding: 20,
  },
  headerText: {
    fontFamily: 'Heebo-Bold',
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
    color: COLORS.primary700,
    fontFamily: 'Heebo-Bold',
    fontSize: 14,
  },
  infoText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: COLORS.grey,
  },
})