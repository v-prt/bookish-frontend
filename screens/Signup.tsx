import { FC, useState, useContext } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Formik } from 'formik'
import * as yup from 'yup'
import { COLORS } from '../GlobalStyles'
import { UserContext } from '../contexts/UserContext'
import { Input } from '../ui/Input'
import { FormItem } from '../ui/FormItem'
import { CustomButton } from '../ui/CustomButton'
import { AlertText } from '../ui/AlertText'

interface Props {
  navigation: any
}

export const Signup: FC<Props> = ({ navigation }) => {
  const { handleSignup } = useContext(UserContext)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .min(2, `That's too short`)
      .max(30, `That's too long`)
      .required('Required'),
    lastName: yup
      .string()
      .min(2, `That's too short`)
      .max(30, `That's too long`)
      .required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().min(6, `That's too short`).required('Required'),
  })

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  }

  const signupHandler = async (values: any, { setStatus }: any) => {
    const result = await handleSignup(
      values.firstName,
      values.lastName,
      values.email,
      values.password
    )
    if (result.error) {
      setStatus(result.error.message)
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.screen}>
      <Text style={styles.logo}>
        book
        <Text style={styles.italic}>ish</Text>
      </Text>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={signupHandler}>
        {({ handleChange, handleBlur, handleSubmit, values, status, isSubmitting }) => (
          <>
            {status && (
              <AlertText
                type='error'
                icon='error'
                title={`Couldn't create account`}
                subtitle={status}
              />
            )}
            <View style={styles.formRow}>
              <FormItem name='firstName' label='First name' style={styles.rowItem}>
                <Input
                  config={{
                    onBlur: handleBlur('firstName'),
                    onChangeText: handleChange('firstName'),
                    value: values.firstName,
                    textContentType: 'givenName',
                  }}
                />
              </FormItem>
              <FormItem name='lastName' label='Last name' style={styles.rowItem}>
                <Input
                  config={{
                    onBlur: handleBlur('lastName'),
                    onChangeText: handleChange('lastName'),
                    value: values.lastName,
                    textContentType: 'familyName',
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
                  autoComplete: 'email',
                  textContentType: 'emailAddress',
                }}
              />
            </FormItem>
            <FormItem name='password' label='Password'>
              <Input
                config={{
                  onBlur: handleBlur('password'),
                  onChangeText: handleChange('password'),
                  value: values.password,
                  secureTextEntry: !passwordVisible,
                  autoComplete: 'off',
                  textContentType: 'newPassword',
                }}
                icon={passwordVisible ? 'visibility' : 'visibility-off'}
                onIconPress={() => {
                  setPasswordVisible(!passwordVisible)
                }}
              />
            </FormItem>
            <View style={styles.buttons}>
              <CustomButton
                type='primary'
                label='Create Account'
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              />
              <CustomButton
                type='secondary'
                label='Already registered? Log In'
                onPress={() => {
                  navigation.navigate('Login')
                }}
              />
            </View>
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  )
}

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    flex: 1,
    padding: 20,
  },
  logo: {
    color: COLORS.accentDark,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 50,
    marginBottom: 20,
  },
  italic: {
    fontFamily: 'RobotoMono-Italic',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '48%',
  },
  buttons: {
    marginVertical: 16,
    gap: 20,
  },
})
