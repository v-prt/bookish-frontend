import { Pressable, StyleSheet, Text } from 'react-native'

interface Props {
  genre: string
  onPress: () => void
}

export const GenreButton: React.FC<Props> = ({ genre, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{genre}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    height: 150,
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
})
