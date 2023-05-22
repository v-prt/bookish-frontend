import { FC, useContext } from 'react'
import { ScrollView, Pressable, View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { BookContext } from '../contexts/BookContext'
import { useQuery } from 'react-query'
import { SimpleBookList } from './SimpleBookList'
import { COLORS } from '../GlobalStyles'
import { MaterialIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

interface Props {
  bookshelf: {
    title: string
    id: string
  }
  navigation: any
}

export const SimpleBookshelf: FC<Props> = ({ bookshelf, navigation }) => {
  const { userId } = useContext(UserContext)
  const { fetchBookshelf } = useContext(BookContext)

  const { data, status } = useQuery(bookshelf.id, () => fetchBookshelf(userId, bookshelf.title))

  // FIXME: improve styling of loading/empty states to keep height the same
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>{bookshelf.title}</Text>
        {status === 'success' && data ? (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              navigation.navigate('DetailedBookshelf', { bookshelf })
            }}
            style={({ pressed }) => [
              styles.bookshelfBtn,
              pressed && styles.pressed,
              !data?.books?.length && styles.disabled,
            ]}
            disabled={!data?.books?.length}>
            <Text style={styles.totalResults}>
              {data.totalResults} {data.totalResults === 1 ? 'book' : 'books'}
            </Text>
            {!!data?.books?.length && (
              <MaterialIcons name='chevron-right' size={20} color={COLORS.accentLight} />
            )}
          </Pressable>
        ) : (
          <ActivityIndicator size='small' color={COLORS.primary400} />
        )}
      </View>

      {status === 'loading' && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.loading}>
          {[...Array(6)].map((_, i) => (
            <View style={[styles.skelement, i === 5 && { marginRight: 20 }]} key={i} />
          ))}
        </ScrollView>
      )}
      {status === 'success' &&
        (data?.books?.length ? (
          <SimpleBookList books={data.books} />
        ) : (
          <View style={styles.noBooks}>
            <Text style={styles.infoText}>This shelf is empty.</Text>
          </View>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
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
  loading: {
    gap: 10,
    marginBottom: 25,
  },
  skelement: {
    // TODO: add shine animation for background color
    height: 170,
    aspectRatio: 2 / 3,
    backgroundColor: COLORS.primary200,
    borderRadius: 10,
    marginLeft: 20,
  },
  noBooks: {
    height: 70,
  },
  infoText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.grey,
    marginHorizontal: 20,
  },
  bookshelfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
  totalResults: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.accentLight,
    marginLeft: 10,
  },
})
