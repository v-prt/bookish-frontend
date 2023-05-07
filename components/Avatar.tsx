import { StyleSheet, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

interface Props {
  initials: string
  size?: string
}

export const Avatar: React.FC<Props> = ({ initials, size }) => {
  // TODO: cute animal icons (allow user to choose one)
  const wrapperStyle = size === 'small' ? { padding: 10 } : { padding: 20 }
  const textStyle = size === 'small' ? { fontSize: 12 } : { fontSize: 20 }

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <Text style={[styles.text, textStyle]}>{initials}</Text>
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
  },
  text: {
    color: COLORS.primary600,
    fontFamily: 'Prata-Regular',
  },
})
