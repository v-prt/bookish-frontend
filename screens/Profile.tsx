import { FC, useContext, useEffect, useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { Avatar } from '../ui/Avatar'
import moment from 'moment'
import axios from 'axios'
import * as yup from 'yup'
import { IconButton } from '../ui/IconButton'
import * as Haptics from 'expo-haptics'
import { MaterialIcons } from '@expo/vector-icons'
import { Formik } from 'formik'
import { FormItem } from '../ui/FormItem'
import { AlertText } from '../ui/AlertText'
import { CustomButton } from '../ui/CustomButton'

interface Props {
  navigation: any
}

export const Profile: FC<Props> = ({ navigation }) => {
  const { userData, updateUser } = useContext(UserContext)
  const books = userData.books
  const numOwned = books?.filter((book: any) => book.owned).length
  const numWantToRead = books?.filter((book: any) => book.bookshelf === 'Want to read').length
  const numRead = books?.filter((book: any) => book.bookshelf === 'Read').length
  const [currentlyReading, setCurrentlyReading] = useState<any>(null)
  const [genreModalVisible, setGenreModalVisible] = useState(false)

  const setBooksReading = async (books: any[]) => {
    const data = await Promise.all(
      books.map(async book => {
        const { data } = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${book.volumeId}`
        )
        return {
          title: data.volumeInfo.title,
          image: data.volumeInfo.imageLinks?.thumbnail,
          author: data.volumeInfo.authors?.[0],
          averageRating: data.volumeInfo.averageRating,
          ratingsCount: data.volumeInfo.ratingsCount,
          ...book,
        }
      })
    )
    setCurrentlyReading(data)
  }

  useEffect(() => {
    const reading = books?.filter((book: any) => book.bookshelf === 'Currently reading')

    if (reading.length) {
      setBooksReading(reading)
    }
  }, [userData])

  const genres = [
    'Action',
    'Adventure',
    'Children',
    'Classics',
    'Comics',
    'Crime',
    'Drama',
    'Fantasy',
    'Fiction',
    'History',
    'Horror',
    'Humor',
    'Manga',
    'Memoir',
    'Music',
    'Mystery',
    'Nonfiction',
    'Paranormal',
    'Philosophy',
    'Poetry',
    'Psychology',
    'Religion',
    'Romance',
    'Science',
    'Sci-Fi',
    'Suspense',
    'Spirituality',
    'Sports',
    'Thriller',
    'Travel',
    'Young Adult',
  ]

  const genresInitialValues = {
    faveGenres: userData?.faveGenres || [],
  }

  const genresSchema = yup.object().shape({
    faveGenres: yup
      .array()
      .min(1, 'Select at least one genre')
      .required('Required')
      .max(6, 'Select up to 6'),
  })

  const handleGenresUpdate = async (values: any, { setStatus }: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus(undefined)
    const result = await updateUser(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      Alert.alert('Success', 'Your favorite genres have been updated')
      setGenreModalVisible(false)
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.profileHeader}>
        <View style={styles.basicInfo}>
          <Avatar initials={`${userData.firstName[0]}${userData.lastName[0]}`} />
          <View>
            <Text style={styles.name}>
              {userData.firstName} {userData.lastName}
            </Text>
            <Text style={styles.dateJoined}>Joined {moment(userData.joined).format('ll')}</Text>
          </View>
        </View>
        <IconButton
          icon='settings'
          color={COLORS.primary600}
          onPress={() => {
            navigation.navigate('Settings')
          }}
        />
      </View>

      <ScrollView style={styles.screenInner}>
        {/* TODO: ratings, reading activity, etc. ? */}
        {!!currentlyReading?.length && (
          <Text style={styles.currentlyReadingText}>
            Currently reading{' '}
            <Text style={styles.currentlyReadingTitle}>"{currentlyReading?.[0].title}"</Text>{' '}
            {currentlyReading?.length > 1 && `+ ${currentlyReading.length - 1} more`}
          </Text>
        )}

        <Text style={styles.headerText}>Books</Text>
        <View style={styles.divider} />
        <View style={styles.bookshelvesContainer}>
          <View style={styles.bookshelfWrapper}>
            <Text style={styles.bookshelfLabel}>Owned</Text>
            <Text style={styles.bookshelfCount}>{numOwned}</Text>
          </View>
          <View style={styles.bookshelfWrapper}>
            <Text style={styles.bookshelfLabel}>Want to read</Text>
            <Text style={styles.bookshelfCount}>{numWantToRead}</Text>
          </View>
          <View style={styles.bookshelfWrapper}>
            <Text style={styles.bookshelfLabel}>Read</Text>
            <Text style={styles.bookshelfCount}>{numRead}</Text>
          </View>
        </View>

        <View style={styles.headerWrapper}>
          <Text style={styles.headerText}>Favorite genres</Text>
          <IconButton
            icon='edit'
            color={COLORS.primary600}
            onPress={() => setGenreModalVisible(true)}
          />
        </View>

        <View style={styles.divider} />
        {userData?.faveGenres?.length > 0 ? (
          <View style={styles.genresContainer}>
            {userData.faveGenres.map((genre: string, i: number) => (
              <View style={styles.genreWrapper} key={i}>
                <Text style={styles.genreLabel}>{genre}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.infoText}>None selected.</Text>
        )}
      </ScrollView>

      <Modal visible={genreModalVisible} animationType='slide'>
        <SafeAreaView style={styles.modalWrapper}>
          <Formik
            initialValues={genresInitialValues}
            validationSchema={genresSchema}
            onSubmit={handleGenresUpdate}>
            {({ handleSubmit, values, setValues, isSubmitting, status }) => (
              <View style={styles.modalInner}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Favorite Genres</Text>
                  <IconButton
                    icon='close'
                    color={COLORS.primary600}
                    onPress={() => setGenreModalVisible(false)}
                  />
                </View>
                {status && (
                  <AlertText type='error' icon='error' title={`Couldn't save`} subtitle={status} />
                )}
                <View style={styles.formWrapper}>
                  <FormItem
                    name='faveGenres'
                    label={
                      // indicate number of genres selected
                      `${values.faveGenres.length} / 6 selected`
                    }>
                    <ScrollView
                      style={styles.genreList}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 10 }}>
                      {genres.map((genre, i) => (
                        <Pressable
                          key={i}
                          onPress={() => {
                            if (
                              values.faveGenres.length === 6 &&
                              !values.faveGenres.includes(genre)
                            )
                              return // prevent selecting more than 6 genres
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                            if (values.faveGenres.includes(genre)) {
                              setValues({
                                ...values,
                                faveGenres: values.faveGenres.filter((g: string) => g !== genre),
                              })
                            } else {
                              setValues({
                                ...values,
                                faveGenres: [...values.faveGenres, genre],
                              })
                            }
                          }}
                          style={[
                            styles.genreItem,
                            values.faveGenres.includes(genre) && styles.genreItemActive,
                          ]}>
                          <Text
                            style={[
                              styles.genreItemText,
                              values.faveGenres.includes(genre) && styles.genreItemActiveText,
                            ]}>
                            {genre}
                          </Text>
                          <MaterialIcons
                            name={values.faveGenres.includes(genre) ? 'check-circle' : 'circle'}
                            color={
                              values.faveGenres.includes(genre)
                                ? COLORS.accentDark
                                : COLORS.primary400
                            }
                            size={18}
                          />
                        </Pressable>
                      ))}
                    </ScrollView>
                  </FormItem>
                </View>
                <View style={styles.buttons}>
                  <CustomButton
                    type='primary'
                    label='Submit'
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  />
                  <CustomButton
                    type='secondary'
                    label='Cancel'
                    onPress={() => setGenreModalVisible(false)}
                  />
                </View>
              </View>
            )}
          </Formik>
        </SafeAreaView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    flex: 1,
  },
  profileHeader: {
    backgroundColor: COLORS.primary300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary300,
  },
  basicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 18,
    color: COLORS.accentLight,
  },
  dateJoined: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
    color: COLORS.grey,
  },
  screenInner: {
    backgroundColor: COLORS.primary100,
    padding: 20,
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
    marginBottom: 8,
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.accentDark,
    marginBottom: 20,
    opacity: 0.6,
  },
  currentlyReadingText: {
    fontFamily: 'RobotoMono-Italic',
    fontSize: 16,
    color: COLORS.grey,
    marginBottom: 20,
  },
  currentlyReadingTitle: {
    color: COLORS.accentDark,
  },
  bookshelvesContainer: {
    marginBottom: 20,
  },
  bookshelfWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary200,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  bookshelfLabel: {
    color: COLORS.primary800,
    fontFamily: 'RobotoMono-Medium',
    fontSize: 16,
  },
  bookshelfCount: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.accentDark,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genreWrapper: {
    backgroundColor: COLORS.primary200,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  genreLabel: {
    color: COLORS.primary800,
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
  },
  infoText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.grey,
  },

  modalWrapper: {
    backgroundColor: COLORS.primary100,
    padding: 20,
    flex: 1,
  },
  modalInner: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
  },
  formWrapper: {
    marginBottom: 20,
  },
  genreList: {
    backgroundColor: COLORS.primary300,
    padding: 10,
    borderRadius: 10,
    // FIXME: make this fill up the rest of the space while still keeping buttons visible
    maxHeight: 400,
  },
  genreItem: {
    backgroundColor: COLORS.primary200,
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.primary500,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreItemActive: {
    borderColor: COLORS.accentDark,
  },
  genreItemText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.primary600,
  },
  genreItemActiveText: {
    color: COLORS.accentDark,
  },
  buttons: {
    gap: 16,
  },
})
