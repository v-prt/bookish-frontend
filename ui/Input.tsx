import { StyleSheet, View, TextInput } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { IconButton } from './IconButton'

interface Props {
  config: TextInput['props']
  icon?: string
  onIconPress: () => void
}

export const Input: React.FC<Props> = ({ config, icon, onIconPress }) => {
  const inputStyles = [styles.input]

  return (
    <View style={styles.inputWrapper}>
      <TextInput {...config} style={inputStyles} selectionColor={COLORS.accentLight} />
      {icon && (
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
    backgroundColor: COLORS.primary200,
    borderRadius: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    color: COLORS.black,
    fontSize: 16,
    opacity: 0.9,
    flex: 1,
    padding: 10,
  },
})
