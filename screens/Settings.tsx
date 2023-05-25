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
  const { userData, updateUser, handleLogout, deleteAccount } = useContext(UserContext)

  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false)

  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton icon='close' color={COLORS.primary600} onPress={() => navigation.goBack()} />
      ),
    })
  })

  // #region Initial Values
  const accountInitialValues = {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
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

  const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Required'),
    newPassword: yup.string().min(6, `That's too short`).required('Required'),
  })
  // #endregion Schemas

  // #region Functions
  const handleAccountUpdate = async (values: any, { setStatus }: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus(undefined)
    const result = await updateUser(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      Alert.alert('Success', 'Your account has been updated')
    }
  }

  const handlePasswordUpdate = async (values: any, { setStatus }: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus(undefined)
    const result = await updateUser(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      Alert.alert('Success', 'Your password has been changed')
      setPasswordModalVisible(false)
    }
  }

  const handleDeleteAccount = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsDeleting(true)
    const result = await deleteAccount()
    if (result?.error) {
      Alert.alert('Error', result.error)
      setIsDeleting(false)
    } else {
      setIsDeleting(false)
      Alert.alert('Success', 'Your account has been deleted', [
        {
          text: 'OK',
          onPress: () => {
            // FIXME: welcome screen shows twice upon logout
            setDeleteAccountModalVisible(false)
            handleLogout()
          },
        },
      ])
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

      {/* CHANGE PASSWORD */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Password</Text>
        <Pressable onPress={() => setPasswordModalVisible(true)}>
          <MaterialIcons name='edit' size={24} color={COLORS.accentLight} />
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
          <MaterialIcons name='logout' size={24} color={COLORS.accentLight} />
        </Pressable>
      </View>

      {/* DELETE ACCOUNT */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Delete Account...</Text>
        <Pressable onPress={() => setDeleteAccountModalVisible(true)}>
          <MaterialIcons name='delete' size={24} color={COLORS.accentLight} />
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
              <CustomButton
                type='primary'
                label='Delete'
                onPress={handleDeleteAccount}
                loading={isDeleting}
              />
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
    fontFamily: 'RobotoMono-Bold',
    color: COLORS.primary600,
    fontSize: 16,
  },
  dangerButtonText: {
    fontFamily: 'RobotoMono-Bold',
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
    fontFamily: 'RobotoMono-Regular',
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
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: COLORS.accentLight,
    borderWidth: 1,
  },
  sectionLabel: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.accentLight,
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
  confirmationText: {
    fontFamily: 'RobotoMono-Regular',
    color: COLORS.primary800,
    marginVertical: 30,
    fontSize: 18,
  },
  buttons: {
    gap: 16,
  },
})
