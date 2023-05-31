import { FC, useContext, useState } from 'react'
import { useQuery } from 'react-query'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  Modal,
  SafeAreaView,
  ActivityIndicator,
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
  const { userData, updateUser, fetchBookshelfSummaries } = useContext(UserContext)

  const { data, status } = useQuery(['bookshelf-summaries', userData], () =>
    fetchBookshelfSummaries()
  )

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

      <View style={styles.screenInnerWrapper}>
        {(status === 'loading' || !data?.books) && (
          <View style={styles.loading}>
            <ActivityIndicator size='large' color={COLORS.primary400} />
          </View>
        )}

        {status === 'success' && data?.books && (
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
              {data.books.map(
                (
                  group: { id: string; books: Book[]; count: number; label: string },
                  index: number
                ) => (
                  <Pressable
                    style={styles.card}
                    key={index}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                      navigation.navigate('DetailedBookshelf', {
                        bookshelf: {
                          id: group.id,
                          title: group.label,
                        },
                      })
                    }}>
                    {group.books?.length ? (
                      <View style={styles.thumbnails}>
                        {group.books.map((book: Book, index: number) => (
                          <View
                            key={index}
                            style={[
                              styles.thumbnailWrapper,
                              { zIndex: group.books.length - index },
                              index === 0
                                ? styles.thumbnailWrapperFirst
                                : index === 1
                                ? styles.thumbnailWrapperSecond
                                : styles.thumbnailWrapperThird,
                            ]}>
                            <ImageLoader
                              source={{ uri: book.image }}
                              style={[
                                { zIndex: group.books.length - index },
                                index === 1
                                  ? styles.thumbnailSecond
                                  : index === 2 && styles.thumbnailThird,
                              ]}
                              borderRadius={5}
                            />
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.blankThumbnail} />
                    )}

                    <Text style={styles.count}>{group.count}</Text>
                    <Text style={styles.label}>{group.label}</Text>
                  </Pressable>
                )
              )}
            </ScrollView>

            <View style={styles.headerWrapper}>
              <Text style={styles.headerText}>Currently reading</Text>
            </View>
            {data.currentlyReading?.length ? (
              <View style={styles.currentlyReadingWrapper}>
                {data.currentlyReading.map((book: Book) => (
                  <DetailedBookCard book={book} key={book.volumeId} />
                ))}
              </View>
            ) : (
              <View style={styles.blankSpace}>
                <MaterialIcons name='book' size={40} color={COLORS.primary400} />
                <Text style={styles.infoText}>No Books</Text>
              </View>
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
              <View style={styles.blankSpace}>
                <MaterialIcons name='book' size={40} color={COLORS.primary400} />
                <Text style={styles.infoText}>No Genres</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

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
  screenInnerWrapper: {
    backgroundColor: COLORS.primary100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  screenInner: {
    paddingVertical: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  booksOverview: {
    paddingHorizontal: 20,
    marginBottom: 40,
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
  thumbnailWrapper: {
    backgroundColor: '#000',
    width: 60,
    aspectRatio: 2 / 3,
    position: 'absolute',
    borderRadius: 5,
  },
  thumbnailWrapperFirst: {
    left: 0,
  },
  thumbnailWrapperSecond: {
    left: '30%',
  },
  thumbnailWrapperThird: {
    right: 0,
  },
  thumbnailSecond: {
    opacity: 0.7,
  },
  thumbnailThird: {
    opacity: 0.5,
  },
  blankThumbnail: {
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

  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 20,
  },
  genreWrapper: {
    backgroundColor: COLORS.primary800,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    opacity: 0.4,
  },
  genreLabel: {
    color: COLORS.white,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  blankSpace: {
    height: 120,
    backgroundColor: COLORS.primary200,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  infoText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
    color: COLORS.grey,
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
