import { FC, useState } from 'react'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { COLORS } from '../GlobalStyles'
import * as Haptics from 'expo-haptics'
import numeral from 'numeral'
import { DetailedBookCard } from './DetailedBookCard'

export const ReadingActivity: FC = () => {
  const { fetchReadingActivity } = useContext(UserContext)
  const [dateRange, setDateRange] = useState('all-time')
  const dates = [
    { label: 'All Time', value: 'all-time' },
    { label: 'This Year', value: 'this-year' },
  ]

  const { data: readingActivity, status: readingActivityStatus } = useQuery(
    ['reading-activity', dateRange],
    () => fetchReadingActivity(dateRange)
  )

  return (
    <View>
      <View style={styles.toggles}>
        {dates.map(date => (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              setDateRange(date.value)
            }}
            key={date.value}
            style={[styles.toggleBtn, dateRange === date.value && styles.activeToggleBtn]}>
            <Text style={[styles.toggleText, dateRange === date.value && styles.activeToggleText]}>
              {date.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {readingActivityStatus === 'success' && readingActivity ? (
        <>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.number}>{readingActivity.totalBooks.toLocaleString()}</Text>
              <Text style={styles.label}>book{readingActivity.totalBooks !== 1 && 's'}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.number}>
                {readingActivity.totalPages > 9999
                  ? numeral(readingActivity.totalPages).format('0a')
                  : readingActivity.totalPages.toLocaleString()}
              </Text>
              <Text style={styles.label}>pages</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.text}>{readingActivity.topCategory}</Text>
              <Text style={styles.label}>top genre</Text>
            </View>
          </View>

          {readingActivity.topAuthor && (
            <View style={styles.row}>
              <View style={styles.card}>
                <Text style={styles.text}>{readingActivity.topAuthor}</Text>
                <Text style={styles.label}>top author</Text>
              </View>
            </View>
          )}

          {!!readingActivity.recentlyRead?.length && (
            <View>
              <View style={styles.headerWrapper}>
                <Text style={styles.headerText}>Recently read</Text>
              </View>
              <View style={styles.books}>
                {readingActivity.recentlyRead.map((book: any) => (
                  <DetailedBookCard key={book.volumeId} book={book} />
                ))}
              </View>
            </View>
          )}
        </>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size='small' color={COLORS.primary400} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  toggles: {
    backgroundColor: COLORS.primary300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginBottom: 20,
    marginHorizontal: 20,
    padding: 3,
    borderRadius: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary300,
  },
  activeToggleBtn: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary600,
  },
  toggleText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.primary600,
    textAlign: 'center',
  },
  activeToggleText: {
    fontFamily: 'RobotoMono-Bold',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.primary200,
    borderRadius: 25,
    padding: 15,
    flex: 1,
  },
  number: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 34,
    color: COLORS.accentDark,
    marginBottom: 5,
  },
  text: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 24,
    color: COLORS.accentDark,
    marginBottom: 5,
  },
  label: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 20,
    color: COLORS.primary700,
  },
  loading: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.primary600,
    borderBottomWidth: 1,
    marginLeft: 20,
    marginBottom: 20,
    paddingRight: 20,
    paddingBottom: 8,
  },
  headerText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 18,
    color: COLORS.primary900,
  },

  books: {
    paddingHorizontal: 20,
  },
})
