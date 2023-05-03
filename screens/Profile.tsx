import { useContext } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { Avatar } from '../components/Avatar'
import { IconButton } from '../ui/IconButton'

interface Props {
  navigation: any
}

export const Profile: React.FC<Props> = ({ navigation }) => {
  const { userData } = useContext(UserContext)

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.accountHeader}>
        <View style={styles.userInfo}>
          <Avatar initials={`${userData.firstName[0]}${userData.lastName[0]}`} />
          <Text style={styles.name}>
            {userData.firstName} {userData.lastName}
          </Text>
        </View>
        <IconButton
          icon='settings'
          color={COLORS.primary600}
          onPress={() => {
            navigation.navigate('Settings')
          }}
        />
      </View>
      {/* TODO: user's favorite genres, bookshelves & num books (overview), reading/rating activity, etc. ? */}
      <View style={styles.profileWrapper}>
        <Text style={styles.headerText}>Favorite Genres</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
  },
  accountHeader: {
    backgroundColor: COLORS.primary300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontFamily: 'Prata-Regular',
    fontSize: 20,
    color: COLORS.primary800,
  },
  profileWrapper: {
    padding: 20,
  },
  headerText: {
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
    marginBottom: 16,
    color: COLORS.accentDark,
  },
})
