import { SetStateAction, FC, Dispatch } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { StyleSheet, View, Pressable } from 'react-native'
import { COLORS } from '../GlobalStyles'
import * as Haptics from 'expo-haptics'

interface Props {
  rating: number | null
  setRating: Dispatch<SetStateAction<number | null>>
}

export const RatingButtons: FC<Props> = ({ rating, setRating }) => {
  const handleRating = (newRating: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (newRating === rating) {
      // if user taps on the same star, clear rating
      setRating(null)
    } else setRating(newRating)
  }

  const starButtons = [...Array(5)].map((_, i) => {
    const name = rating && i < rating ? 'star' : 'star-border'
    const color = rating && i < rating ? 'gold' : '#ccc'

    return (
      <Pressable key={i} onPress={() => handleRating(i + 1)}>
        <MaterialIcons name={name} size={30} color={color} />
      </Pressable>
    )
  })

  return <View style={styles.container}>{starButtons}</View>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary600,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
})
