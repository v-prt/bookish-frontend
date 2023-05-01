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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentLight,
    borderRadius: 50,
    height: 45,
    width: 45,
  },
  text: {
    color: COLORS.white,
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
  },
})
