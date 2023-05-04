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
    backgroundColor: COLORS.primary200,
    borderWidth: 1,
    borderColor: COLORS.primary500,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    padding: 20,
  },
  text: {
    color: COLORS.primary600,
    fontFamily: 'Prata-Regular',
    fontSize: 20,
  },
})
