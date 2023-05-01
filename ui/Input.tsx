import { StyleSheet, View, TextInput } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { IconButton } from './IconButton'
import { MaterialIcons } from '@expo/vector-icons'

interface Props {
  config: TextInput['props']
  icon?: keyof typeof MaterialIcons.glyphMap
  onIconPress?: () => void
}

export const Input: React.FC<Props> = ({ config, icon, onIconPress }) => {
  return (
    <View style={styles.inputWrapper}>
      <TextInput {...config} style={styles.input} selectionColor={COLORS.accentLight} />
      {icon && onIconPress && (
        <IconButton
          icon={icon}
          color={COLORS.grey}
          onPress={onIconPress}
          size={14}
          disabled={!onIconPress}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    height: 40,
    backgroundColor: COLORS.primary200,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    color: COLORS.primary800,
    fontSize: 16,
    opacity: 0.9,
    flex: 1,
    padding: 10,
  },
})
