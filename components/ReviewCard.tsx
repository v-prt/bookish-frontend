import React, { FC } from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { MaterialIcons } from '@expo/vector-icons'
import { Avatar } from '../ui/Avatar'
import moment from 'moment'

interface Props {
  review: any
  lastChild?: boolean
}

const { width } = Dimensions.get('window')

export const ReviewCard: FC<Props> = ({ review, lastChild }) => {
  const renderStars = (rating: number) => {
    let stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={
            rating > i + 0.5 ? 'star' : rating > i && rating < i + 1 ? 'star-half' : 'star-border'
          }
          size={18}
          color={rating > i ? COLORS.accentLight : COLORS.primary500}
        />
      )
    }
    return stars
  }

  return (
    <View style={[styles.reviewWrapper, lastChild && styles.lastChild]}>
      <View style={styles.reviewHeader}>
        <Avatar initials={`${review.user.firstName[0]}${review.user.lastName[0]}`} size='small' />

        <View>
          <Text style={styles.name} numberOfLines={1}>
            {review.user.firstName} {review.user.lastName}
          </Text>
          <View style={styles.stars}>{renderStars(review.rating)}</View>
        </View>
      </View>

      <Text style={styles.reviewText} numberOfLines={4}>
        {review?.review?.text}
      </Text>

      <Text style={styles.reviewDate}>{moment(review?.review?.date).format('ll')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  reviewWrapper: {
    width: width - 40,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    gap: 12,
    marginLeft: 20,
  },
  lastChild: {
    marginRight: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.accentLight,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  reviewDate: {
    fontFamily: 'RobotoMono-Medium',
    fontSize: 14,
    color: COLORS.grey,
    opacity: 0.6,
  },
  reviewText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
    color: COLORS.grey,
  },
})
