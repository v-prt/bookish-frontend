import { FC } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

interface Props {
  initials: string
  size?: string
}

export const Avatar: FC<Props> = ({ initials, size }) => {
  const wrapperStyle = size === 'small' ? { padding: 8 } : { padding: 10 }
  const textStyle = size === 'small' ? { fontSize: 16 } : { fontSize: 20 }

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <Text style={[styles.text, textStyle]}>{initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    opacity: 0.5,
    aspectRatio: 1,
  },
  text: {
    color: COLORS.white,
    fontFamily: 'RobotoMono-Bold',
  },
})
