import { StyleSheet, View, Text } from 'react-native'
import { Field, ErrorMessage, FormikProps } from 'formik'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS } from '../GlobalStyles'

interface Props {
  name: string
  label?: string
  sublabel?: string
  subtext?: string
  style?: any
  labelStyle?: any
  children: any
  required?: boolean
}

export const FormItem: React.FC<Props> = ({
  name,
  label,
  sublabel,
  subtext,
  style,
  labelStyle,
  children,
  required,
}) => {
  return (
    <Field>
      {({ form }: { form: FormikProps<any> }) => {
        const error = form.errors[name] && form.touched[name]
        return (
          <View style={[styles.wrapper, style]}>
            {label && (
              <Text style={[styles.label, labelStyle, error && styles.error]}>
                {label}
                {required && ' *'}
              </Text>
            )}
            {sublabel && <Text style={styles.sublabel}>{subtext}</Text>}
            {children}
            <ErrorMessage
              name={name}
              render={msg => (
                <View style={[styles.errorTextWrapper, labelStyle]}>
                  <MaterialIcons name='error-outline' size={14} color={COLORS.error} />
                  <Text style={styles.errorText}>{msg}</Text>
                </View>
              )}
            />
          </View>
        )
      }}
    </Field>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    color: COLORS.primary900,
    marginBottom: 5,
    fontSize: 16,
    fontFamily: 'Heebo-Bold',
    opacity: 0.7,
  },
  sublabel: {
    opacity: 0.5,
    fontSize: 12,
  },
  errorTextWrapper: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    color: COLORS.error,
    opacity: 1,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: 5,
  },
})
