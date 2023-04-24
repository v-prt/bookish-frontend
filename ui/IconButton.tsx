import { StyleSheet, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface Props {
  icon: string
  size?: number
  color: string
  onPress: () => void
  small?: boolean
  disabled?: boolean
}

export const IconButton: React.FC<Props> = ({
  icon,
  size = 24,
  color,
  onPress,
  small,
  disabled,
}) => {
  return (
    <Pressable
      onPress={() => {
        if (!disabled) onPress()
      }}
      style={({ pressed }) => [
        !small && styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      {/* FIXME: typescript error */}
      <MaterialIcons name={icon} size={size} color={disabled ? '#eee' : color} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.3,
  },
})
