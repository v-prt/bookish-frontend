import { useContext, useState } from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { UserContext } from '../contexts/UserContext'
import { BookContext } from '../contexts/BookContext'
import { Formik } from 'formik'
import { AlertText } from '../ui/AlertText'
import { CustomButton } from '../ui/CustomButton'
import { FormItem } from '../ui/FormItem'
import { COLORS } from '../GlobalStyles'
import { MaterialIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

interface Props {
  route: any
}

export const ManageBook: React.FC<Props> = ({
  route: {
    params: { volumeId, existingBook },
  },
}) => {
  console.log(volumeId, existingBook)
  const { userId } = useContext(UserContext)
  const { addBook, updateBook } = useContext(BookContext)

  const bookshelfOptions = ['Want to read', 'Currently reading', 'Read']
  const ownedOptions = [true, false]
  const [selectedDate, setSelectedDate] = useState(new Date())

  const initialValues = existingBook
    ? {
        ...existingBook,
      }
    : {
        volumeId,
        userId,
        bookshelf: '',
        owned: false,
        dateRead: '',
        rating: '',
        review: '',
      }

  const handleSubmit = async (values: any, { setStatus }: any) => {
    console.log(values)
    // if (existingBook) {
    //   const result = await updateBook(values)
    //   if (result.error) {
    //     setStatus(result.error.message)
    //   }
    // } else {
    //   const result = await addBook(values)
    //   if (result.error) {
    //     setStatus(result.error.message)
    //   }
    // }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue, status, submitForm, isSubmitting }) => (
        <KeyboardAwareScrollView style={styles.screen}>
          {status && (
            <AlertText type='error' icon='error' title={`Couldn't save book`} subtitle={status} />
          )}
          <View>
            <FormItem name='owned' label='Owned'>
              <View style={styles.options}>
                {ownedOptions.map((owned, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      setFieldValue('owned', owned)
                    }}
                    style={[styles.optionButton, values.owned === owned && styles.selectedButton]}>
                    <Text
                      style={[styles.optionText, values.owned === owned && styles.selectedText]}>
                      {owned ? 'Yes' : 'No'}
                    </Text>
                    <MaterialIcons
                      name={values.owned === owned ? 'check-circle' : 'circle'}
                      color={values.owned === owned ? COLORS.accentDark : COLORS.primary400}
                      size={18}
                    />
                  </Pressable>
                ))}
              </View>
            </FormItem>

            <FormItem name='bookshelf' label='Bookshelf'>
              <View style={styles.options}>
                {bookshelfOptions.map(bookshelf => (
                  <Pressable
                    key={bookshelf}
                    onPress={() => {
                      setFieldValue('bookshelf', bookshelf)
                    }}
                    style={[
                      styles.optionButton,
                      values.bookshelf === bookshelf && styles.selectedButton,
                    ]}>
                    <Text
                      style={[
                        styles.optionText,
                        values.bookshelf === bookshelf && styles.selectedText,
                      ]}>
                      {bookshelf}
                    </Text>
                    <MaterialIcons
                      name={values.bookshelf === bookshelf ? 'check-circle' : 'circle'}
                      color={values.bookshelf === bookshelf ? COLORS.accentDark : COLORS.primary400}
                      size={18}
                    />
                  </Pressable>
                ))}
              </View>
            </FormItem>

            {values.bookshelf === 'Read' && (
              <>
                <FormItem name='dateRead'>
                  <View style={styles.datePicker}>
                    <View style={styles.labelWrapper}>
                      <MaterialIcons name='calendar-today' color={COLORS.primary600} size={20} />
                      <Text style={styles.labelText}>Date read</Text>
                    </View>
                    <DateTimePicker
                      testID='dateTimePicker'
                      mode='date'
                      value={selectedDate}
                      is24Hour={true}
                      themeVariant='light'
                      accentColor={COLORS.accentLight}
                      style={{ flex: 1 }}
                      onChange={(event, date: any) => {
                        setSelectedDate(date)
                        setFieldValue('dateRead', date)
                      }}
                    />
                  </View>
                </FormItem>

                {/* TODO: 
                - add/delete rating (stars with haptic feedback)
                - add/delete review (text input) */}
              </>
            )}

            <CustomButton type='primary' label='Save' onPress={submitForm} loading={isSubmitting} />
          </View>
        </KeyboardAwareScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
    padding: 20,
    gap: 20,
  },
  options: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: COLORS.primary200,
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.primary500,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedButton: {
    borderColor: COLORS.accentDark,
  },
  optionText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: COLORS.primary600,
  },
  selectedText: {
    color: COLORS.accentDark,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary600,
    padding: 10,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  labelText: {
    fontFamily: 'Heebo-Bold',
    fontSize: 16,
    color: COLORS.primary600,
  },
})
