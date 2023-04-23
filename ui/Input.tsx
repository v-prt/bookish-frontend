import { StyleSheet, View, TextInput } from 'react-native'
import { COLORS } from '../GlobalStyles'

interface Props {
  config: TextInput['props']
  icon?: string
  iconOnPress?: () => void
}

export const Input: React.FC<Props> = ({ config, icon, iconOnPress }) => {
  const inputStyles = [styles.input]

  return (
    <View style={styles.inputWrapper}>
      <TextInput {...config} style={inputStyles} selectionColor={COLORS.accentLight} />
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    width: '100%',
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
  iconButton: {
    padding: 10,
  },
})
