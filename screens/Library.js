import { StyleSheet, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

export const Library = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Library Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
  },
  text: {
    fontSize: 30,
  },
})
