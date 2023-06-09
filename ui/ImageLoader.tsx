import { FC, useEffect, useState, useRef } from 'react'
import { Animated, StyleSheet, View, Image } from 'react-native'

interface Props {
  style?: any
  source: any
  borderRadius?: number
}

export const ImageLoader: FC<Props> = ({ style, source, borderRadius }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: imageLoaded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [imageLoaded])

  return (
    <View style={style}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={source}
          style={[styles.image, { borderRadius }]}
          onLoad={() => {
            setImageLoaded(true)
          }}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
})
