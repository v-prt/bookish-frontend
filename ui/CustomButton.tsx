import { StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native'
import { COLORS } from '../GlobalStyles'

interface Props {
  type: 'primary' | 'secondary'
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
}

export const CustomButton: React.FC<Props> = ({ type, label, onPress, loading, disabled }) => {
  const buttonStyle = type === 'primary' ? styles.primaryBtn : styles.secondaryBtn
  const textStyle = type === 'primary' ? styles.primaryTxt : styles.secondaryTxt

  return (
    <Pressable
      style={({ pressed }) => [styles.button, buttonStyle, pressed && styles.pressed]}
      onPress={disabled ? null : onPress}>
      <Text style={[styles.text, textStyle]}>
        {loading ? <ActivityIndicator size='small' color={COLORS.primary300} /> : label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    height: 45,
  },
  pressed: {
    opacity: 0.7,
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
    fontFamily: 'RobotoMono-Bold',
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
