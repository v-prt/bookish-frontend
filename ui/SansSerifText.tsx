import { Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

interface Props {
  style?: object
  bold?: boolean
  children: React.ReactNode
}

export const SansSerifText: React.FC<Props> = ({ style, bold, children }) => {
  return (
    <Text
      style={[{ fontFamily: bold ? 'Heebo-Bold' : 'Heebo-Regular', color: COLORS.black }, style]}>
      {children}
    </Text>
  )
}
