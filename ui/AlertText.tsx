import { StyleSheet, View, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS } from '../GlobalStyles'

interface Props {
  type: 'error' | 'warning' | 'success' | 'info'
  icon?: keyof typeof MaterialIcons.glyphMap
  title?: string
  subtitle?: string
}

export const AlertText: React.FC<Props> = ({ type, icon, title, subtitle }) => {
  const color =
    type === 'error'
      ? COLORS.error
      : type === 'warning'
      ? COLORS.warning
      : type === 'success'
      ? COLORS.primary400
      : COLORS.primary100

  return (
    <View style={styles.wrapper}>
      {icon && <MaterialIcons name={icon} size={18} color={color} style={styles.icon} />}
      <View style={styles.text}>
        {title && (
          <Text
            style={[
              // FIXME: typescript error
              styles.title,
              {
                color,
              },
            ]}>
            {title}
          </Text>
        )}
        {subtitle && <Text>{subtitle}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  icon: {
    marginTop: 2,
    marginRight: 12,
  },
  text: {
    flex: 1,
  },
  title: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 18,
    marginBottom: 5,
  },
})
