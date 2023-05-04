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
          <View style={styles.genresWrapper}>
            {userData.faveGenres.map((genre: string, index: number) => (
              <Text key={index} style={styles.genre}>
                {genre}
              </Text>
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
  genresWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genre: {
    fontFamily: 'Heebo-Bold',
    fontSize: 14,
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.primary600,
    borderRadius: 10,
    color: COLORS.primary700,
  },
  infoText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: COLORS.grey,
  },
})
