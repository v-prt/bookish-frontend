import { Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

interface Props {
  style?: object
  children: React.ReactNode
}

export const SerifText: React.FC<Props> = ({ style, children }) => {
  return (
    <Text style={[{ fontFamily: 'Prata-Regular', color: COLORS.primary900 }, style]}>
      {children}
    </Text>
  )
}
