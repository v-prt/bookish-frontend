import { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  View,
  Modal,
  Alert,
  SafeAreaView,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { Formik } from 'formik'
import { FormItem } from '../ui/FormItem'
import { Input } from '../ui/Input'
import { AlertText } from '../ui/AlertText'
import { CustomButton } from '../ui/CustomButton'
import * as yup from 'yup'
import * as Haptics from 'expo-haptics'
import { MaterialIcons } from '@expo/vector-icons'
import { IconButton } from '../ui/IconButton'

interface Props {
  navigation: any
}

export const Settings: React.FC<Props> = ({ navigation }) => {
  const { userData, updateUserData, handleLogout, handleDeleteAccount } = useContext(UserContext)

  const [genreModalVisible, setGenreModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false)

  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton icon='close' color={COLORS.primary600} onPress={() => navigation.goBack()} />
      ),
    })
  })

  const genres = [
    'Action',
    'Adventure',
    'Children',
    'Classics',
    'Comics',
    'Contemporary',
    'Crime',
    'Drama',
    'Fantasy',
    'Fiction',
    'Historical Fiction',
    'Horror',
    'Humor and Comedy',
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
    'Science Fiction',
    'Self Help',
    'Suspense',
    'Spirituality',
    'Sports',
    'Thriller',
    'Travel',
    'Young Adult',
  ]

  // #region Initial Values
  const accountInitialValues = {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
  }

  const genresInitialValues = {
    faveGenres: userData?.faveGenres || [],
  }

  const passwordInitialValues = {
    currentPassword: '',
    newPassword: '',
  }
  // #endregion Initial Values

  // #region Schemas
  const accountSchema = yup.object().shape({
    firstName: yup.string().min(2, `That's too short`).required('Required'),
    lastName: yup.string().min(2, `That's too short`).required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
  })

  const genresSchema = yup.object().shape({
    faveGenres: yup
      .array()
      .min(1, 'Select at least one genre')
      .required('Required')
      .max(6, 'Select up to 6'),
  })

  const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Required'),
    newPassword: yup.string().min(6, `That's too short`).required('Required'),
  })
  // #endregion Schemas

  // #region Functions
  const handleAccountUpdate = async (values: any, { setStatus }: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus(undefined)
    const result = await updateUserData(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      Alert.alert('Success', 'Your account has been updated')
    }
  }

  const handleGenresUpdate = async (values: any, { setStatus }: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus(undefined)
    const result = await updateUserData(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      Alert.alert('Success', 'Your favorite genres have been updated')
      setGenreModalVisible(false)
    }
  }

  // TODO: test changing password
  const handlePasswordUpdate = async (values: any, { setStatus }: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus(undefined)
    const result = await updateUserData(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      Alert.alert('Success', 'Your password has been changed')
      setPasswordModalVisible(false)
    }
  }
  // #endregion Functions

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}>
      {/* ACCOUNT SETTINGS */}
      <Formik
        initialValues={accountInitialValues}
        validationSchema={accountSchema}
        onSubmit={handleAccountUpdate}>
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, status }) => (
          <View style={styles.formWrapper}>
            {status && (
              <AlertText
                type='error'
                icon='error'
                title={`Couldn't update account`}
                subtitle={status}
              />
            )}
            {/* TODO: avatar selection */}
            <View style={styles.formRow}>
              <FormItem name='firstName' label='First name' style={styles.rowItem}>
                <Input
                  config={{
                    onBlur: handleBlur('firstName'),
                    onChangeText: handleChange('firstName'),
                    value: values.firstName,
                  }}
                />
              </FormItem>
              <FormItem name='lastName' label='Last name' style={styles.rowItem}>
                <Input
                  config={{
                    onBlur: handleBlur('lastName'),
                    onChangeText: handleChange('lastName'),
                    value: values.lastName,
                  }}
                />
              </FormItem>
            </View>
            <FormItem name='email' label='Email'>
              <Input
                config={{
                  onBlur: handleBlur('email'),
                  onChangeText: handleChange('email'),
                  value: values.email,
                  keyboardType: 'email-address',
                  autoCapitalize: 'none',
                }}
              />
            </FormItem>
            <View style={styles.saveBtn}>
              <CustomButton
                type='primary'
                label='Save'
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting || values === accountInitialValues}
              />
            </View>
          </View>
        )}
      </Formik>

      {/* FAVE GENRE SELECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Edit Favorite Genres...</Text>
        <Pressable onPress={() => setGenreModalVisible(true)}>
          <MaterialIcons name='edit' size={24} color={COLORS.primary600} />
        </Pressable>
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
                  <Text style={styles.modalTitle}>Edit Favorite Genres</Text>
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
                      {genres.map(genre => (
                        <Pressable
                          key={genre}
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
                          {values.faveGenres.includes(genre) && (
                            <MaterialIcons
                              name='check-circle-outline'
                              color={COLORS.accentDark}
                              size={18}
                            />
                          )}
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
                    onPress={() => setPasswordModalVisible(false)}
                  />
                </View>
              </View>
            )}
          </Formik>
        </SafeAreaView>
      </Modal>

      {/* CHANGE PASSWORD */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Change Password...</Text>
        <Pressable onPress={() => setPasswordModalVisible(true)}>
          <MaterialIcons name='edit' size={24} color={COLORS.primary600} />
        </Pressable>
      </View>

      <Modal visible={passwordModalVisible} animationType='slide'>
        <SafeAreaView style={styles.modalWrapper}>
          <Formik
            initialValues={passwordInitialValues}
            validationSchema={passwordSchema}
            onSubmit={handlePasswordUpdate}>
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, status }) => (
              <View style={styles.modalInner}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Change Password</Text>
                  <IconButton
                    icon='close'
                    color={COLORS.primary600}
                    onPress={() => setPasswordModalVisible(false)}
                  />
                </View>
                {status && (
                  <AlertText
                    type='error'
                    icon='error'
                    title={`Couldn't change password`}
                    subtitle={status}
                  />
                )}
                <View style={styles.formWrapper}>
                  <FormItem name='currentPassword' label='Current password'>
                    <Input
                      config={{
                        onBlur: handleBlur('currentPassword'),
                        onChangeText: handleChange('currentPassword'),
                        value: values.currentPassword,
                        secureTextEntry: !currentPasswordVisible,
                      }}
                      icon={currentPasswordVisible ? 'visibility' : 'visibility-off'}
                      onIconPress={() => {
                        setCurrentPasswordVisible(!currentPasswordVisible)
                      }}
                    />
                  </FormItem>
                  <FormItem name='newPassword' label='New password'>
                    <Input
                      config={{
                        onBlur: handleBlur('newPassword'),
                        onChangeText: handleChange('newPassword'),
                        value: values.newPassword,
                        secureTextEntry: !newPasswordVisible,
                      }}
                      icon={newPasswordVisible ? 'visibility' : 'visibility-off'}
                      onIconPress={() => {
                        setNewPasswordVisible(!newPasswordVisible)
                      }}
                    />
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
                    onPress={() => setPasswordModalVisible(false)}
                  />
                </View>
              </View>
            )}
          </Formik>
        </SafeAreaView>
      </Modal>

      {/* SIGN OUT */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Sign Out</Text>
        <Pressable onPress={handleLogout}>
          <MaterialIcons name='logout' size={24} color={COLORS.primary600} />
        </Pressable>
      </View>

      {/* DELETE ACCOUNT */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Delete Account...</Text>
        <Pressable onPress={() => setDeleteAccountModalVisible(true)}>
          <MaterialIcons name='delete' size={24} color={COLORS.primary600} />
        </Pressable>
      </View>

      <Modal visible={deleteAccountModalVisible} animationType='slide'>
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalInner}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Account</Text>
              <IconButton
                icon='close'
                color={COLORS.primary600}
                onPress={() => setDeleteAccountModalVisible(false)}
              />
            </View>
            <Text style={styles.confirmationText}>
              Are you sure you want to delete your Bookish account? This action cannot be undone.
            </Text>
            <View style={styles.buttons}>
              {/* TODO: test deleting account */}
              <CustomButton type='primary' label='Delete' onPress={handleDeleteAccount} />
              <CustomButton
                type='secondary'
                label='Cancel'
                onPress={() => setDeleteAccountModalVisible(false)}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
    padding: 20,
  },
  buttonText: {
    fontFamily: 'Heebo-Bold',
    color: COLORS.primary600,
    fontSize: 16,
  },
  dangerButtonText: {
    fontFamily: 'Heebo-Bold',
    color: COLORS.error,
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '48%',
  },
  flatButton: {
    backgroundColor: 'transparent',
  },
  flatButtonText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: COLORS.primary300,
  },
  saveBtn: {
    marginTop: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    padding: 10,
    borderRadius: 10,
    borderColor: COLORS.primary300,
    borderWidth: 1,
  },
  dangerSection: {
    borderColor: COLORS.error,
  },
  sectionLabel: {
    fontFamily: 'Heebo-Bold',
    fontSize: 16,
    color: COLORS.primary600,
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
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
  },
  formWrapper: {
    marginBottom: 20,
  },
  confirmationText: {
    marginVertical: 30,
    fontSize: 18,
  },
  buttons: {
    gap: 16,
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
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: COLORS.primary600,
  },
  genreItemActiveText: {
    color: COLORS.accentDark,
  },
})
