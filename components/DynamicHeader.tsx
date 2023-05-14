import { FC } from 'react'
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

interface Props {
  scrolledPastTop: boolean
}

export const DynamicHeader: FC<Props> = ({ scrolledPastTop }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current
  const heightAnim = useRef(new Animated.Value(60)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: scrolledPastTop ? 0 : 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(heightAnim, {
        toValue: scrolledPastTop ? 0 : 60,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start()
  }, [scrolledPastTop])

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          height: heightAnim,
        },
        styles.header,
      ]}>
      <Text style={styles.logo}>
        book
        <Text style={styles.italic}>ish</Text>
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  logo: {
    color: COLORS.accentDark,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 40,
  },
  italic: {
    fontFamily: 'RobotoMono-Italic',
  },
})
