import { FC, useContext, useState } from 'react'
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
import * as yup from 'yup'
import { IconButton } from '../ui/IconButton'
import * as Haptics from 'expo-haptics'
import { MaterialIcons } from '@expo/vector-icons'
import { Formik } from 'formik'
import { FormItem } from '../ui/FormItem'
import { AlertText } from '../ui/AlertText'
import { CustomButton } from '../ui/CustomButton'
import { DetailedBookCard } from '../components/DetailedBookCard'
import { Book } from '../Interfaces'
import { ImageLoader } from '../ui/ImageLoader'

interface Props {
  navigation: any
}

export const Profile: FC<Props> = ({ navigation }) => {
  const { userData, updateUser } = useContext(UserContext)
  const { books, currentlyReading } = userData

  const [genreModalVisible, setGenreModalVisible] = useState(false)

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

      <ScrollView
        style={styles.screenInner}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}>
        <ScrollView
          style={styles.booksOverview}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: 30,
          }}>
          {books.map((group: { books: Book[]; count: number; label: string }, index: number) => (
            // TODO: link to detailed bookshelf / ratings list
            <View style={styles.card} key={index}>
              {group.books?.length ? (
                <View style={styles.thumbnails}>
                  {group.books.map((book: Book, index: number) => (
                    <ImageLoader
                      key={index}
                      source={{ uri: book.image }}
                      style={[
                        styles.thumbnail,
                        { zIndex: group.books.length - index },
                        index === 0
                          ? styles.thumbnailFirst
                          : index === 1
                          ? styles.thumbnailSecond
                          : styles.thumbnailThird,
                      ]}
                      borderRadius={5}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.noThumbnails} />
              )}

              <Text style={styles.count}>{group.count}</Text>
              <Text style={styles.label}>{group.label}</Text>
            </View>
          ))}
        </ScrollView>

        {!!currentlyReading?.length && (
          <>
            <View style={styles.headerWrapper}>
              <Text style={styles.headerText}>Currently reading</Text>
            </View>
            <View style={styles.currentlyReadingWrapper}>
              {currentlyReading.map((book: Book) => (
                <DetailedBookCard book={book} key={book.volumeId} />
              ))}
            </View>
          </>
        )}

        <View style={styles.headerWrapper}>
          <Text style={styles.headerText}>Favorite genres</Text>
          <IconButton
            icon='edit'
            color={COLORS.primary600}
            onPress={() => setGenreModalVisible(true)}
          />
        </View>
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
                    style={{ flex: 1 }}
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
    height: 65,
    paddingHorizontal: 20,
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    paddingVertical: 30,
  },
  booksOverview: {
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  card: {
    backgroundColor: COLORS.primary200,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
    width: 150,
    height: 160,
    marginRight: 10,
  },
  thumbnails: {
    marginBottom: 10,
    position: 'relative',
  },
  thumbnail: {
    width: 60,
    aspectRatio: 2 / 3,
    position: 'absolute',
  },
  thumbnailFirst: {
    left: 0,
  },
  thumbnailSecond: {
    left: '30%',
    top: 5,
  },
  thumbnailThird: {
    right: 0,
    top: 10,
  },
  noThumbnails: {
    width: 50,
    aspectRatio: 2 / 3,
    backgroundColor: COLORS.primary400,
    borderRadius: 5,
  },
  count: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
    marginTop: 'auto',
  },
  label: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
    color: COLORS.grey,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.primary400,
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
  currentlyReadingWrapper: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  bookshelvesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
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
    fontSize: 18,
    color: COLORS.accentDark,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 20,
  },
  genreWrapper: {
    backgroundColor: COLORS.primary200,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  genreLabel: {
    color: COLORS.primary800,
    fontFamily: 'RobotoMono-Medium',
    fontSize: 14,
  },
  infoText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.grey,
    marginLeft: 20,
  },

  modalWrapper: {
    backgroundColor: COLORS.primary100,
    padding: 20,
    flex: 1,
  },
  modalInner: {
    flex: 1,
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
    flex: 1,
    marginBottom: 20,
  },
  genreList: {
    backgroundColor: COLORS.primary300,
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  genreItem: {
    backgroundColor: COLORS.primary200,
    padding: 8,
    // borderWidth: 1,
    // borderColor: COLORS.primary500,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreItemActive: {
    backgroundColor: COLORS.primary100,
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
