import { FC, useState, useContext } from 'react'
import { View, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as yup from 'yup'
import { Formik } from 'formik'
import { UserContext } from '../contexts/UserContext'
import { Input } from '../ui/Input'
import { FormItem } from '../ui/FormItem'
import { CustomButton } from '../ui/CustomButton'
import { styles } from './Signup'
import { AlertText } from '../ui/AlertText'

interface Props {
  navigation: any
}

export const Login: FC<Props> = ({ navigation }) => {
  const { handleLogin } = useContext(UserContext)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().required('Required'),
  })

  const initialValues = {
    email: '',
    password: '',
  }

  const loginHandler = async (values: any, { setStatus }: any) => {
    const result = await handleLogin(values.email, values.password)
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
        onSubmit={loginHandler}>
        {({ handleChange, handleBlur, handleSubmit, values, status, isSubmitting }) => (
          <>
            {status && (
              <AlertText type='error' icon='error' title={`Couldn't log in`} subtitle={status} />
            )}
            <FormItem name='email' label='Email'>
              <Input
                config={{
                  onBlur: handleBlur('email'),
                  onChangeText: handleChange('email'),
                  value: values.email,
                  autoCapitalize: 'none',
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
                  autoComplete: 'password',
                  textContentType: 'password',
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
                label='Log In'
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              />
              <CustomButton
                type='secondary'
                label='Not registered? Sign Up'
                onPress={() => navigation.navigate('Signup')}
              />
            </View>
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  )
}
