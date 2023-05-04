import { StyleSheet, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

interface Props {
  initials: string
}

export const Avatar: React.FC<Props> = ({ initials }) => {
  // TODO: cute animal icons (allow user to choose one)
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.primary300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    padding: 15,
  },
  text: {
    color: COLORS.accentDark,
    fontFamily: 'Prata-Regular',
    fontSize: 24,
  },
})
