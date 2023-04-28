import { StyleSheet, Pressable, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

interface Props {
  type: 'primary' | 'secondary'
  label: string
  onPress: () => void
}

export const CustomButton: React.FC<Props> = ({ type, label, onPress }) => {
  const buttonStyle = type === 'primary' ? styles.primaryBtn : styles.secondaryBtn
  const textStyle = type === 'primary' ? styles.primaryTxt : styles.secondaryTxt

  return (
    <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  primaryBtn: {
    backgroundColor: COLORS.accentLight,
    borderColor: COLORS.accentLight,
  },
  secondaryBtn: {
    backgroundColor: COLORS.primary100,
    borderColor: COLORS.accentLight,
  },

  text: {
    fontFamily: 'Heebo-Bold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  primaryTxt: {
    color: COLORS.primary100,
    textAlign: 'center',
  },
  secondaryTxt: {
    color: COLORS.accentLight,
    textAlign: 'center',
  },
})
