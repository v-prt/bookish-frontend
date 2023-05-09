import { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { UserContext } from '../contexts/UserContext'
import { BookContext } from '../contexts/BookContext'
import { Formik } from 'formik'
import { AlertText } from '../ui/AlertText'
import { CustomButton } from '../ui/CustomButton'
import { Input } from '../ui/Input'
import { FormItem } from '../ui/FormItem'
import { COLORS } from '../GlobalStyles'
import { MaterialIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { RatingButtons } from '../components/RatingButtons'
import * as Haptics from 'expo-haptics'
import * as yup from 'yup'

interface Props {
  route: any
  navigation: any
}

export const ManageBook: React.FC<Props> = ({
  route: {
    params: { volumeId, existingBook },
  },
  navigation,
}) => {
  const { userId } = useContext(UserContext)
  const { addBook, updateBook } = useContext(BookContext)

  const bookshelfOptions = ['Want to read', 'Currently reading', 'Read']
  const ownedOptions = [true, false]
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    if (existingBook?.dateRead) {
      setSelectedDate(new Date(existingBook.dateRead))
    }
  }, [])

  useEffect(() => {
    if (existingBook) {
      navigation.setOptions({ title: 'Manage Book' })
    } else {
      navigation.setOptions({ title: 'Add Book' })
    }
  })

  const validationSchema = yup.object().shape({
    owned: yup.boolean().required('Required'),
    bookshelf: yup.string().required('Required'),

    // not required (for "Read" books only)
    dateRead: yup.date().nullable(),
    rating: yup.number().nullable(),
    review: yup.string().nullable(),
  })

  const initialValues = existingBook
    ? {
        ...existingBook,
      }
    : {
        volumeId,
        userId,
        bookshelf: null,
        owned: null,
        dateRead: null,
        rating: null,
        review: null,
      }

  const handleSubmit = async (values: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    const data = {
      ...values,
      review: values.review && {
        date: new Date(),
        text: values.review,
      },
    }

    try {
      if (existingBook) {
        await updateBook(existingBook._id, data)
      } else {
        await addBook(data)
      }
      // close modal on success
      navigation.goBack()
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again later.')
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({ values, setFieldValue, status, submitForm, isSubmitting }) => (
        <KeyboardAwareScrollView
          style={styles.screen}
          contentContainerStyle={{
            paddingBottom: 40,
          }}>
          {status && (
            <AlertText type='error' icon='error' title={`Couldn't save book`} subtitle={status} />
          )}
          <>
            <FormItem name='owned' label='Owned'>
              <View style={styles.options}>
                {ownedOptions.map((owned, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
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
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                      if (bookshelf !== 'Read') {
                        setFieldValue('dateRead', null)
                        setFieldValue('rating', null)
                        setFieldValue('review', null)
                      }
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

                <FormItem name='rating' label='Rating'>
                  <RatingButtons
                    rating={values.rating}
                    setRating={rating => {
                      setFieldValue('rating', rating)
                    }}
                  />
                </FormItem>

                <FormItem name='review' label='Review'>
                  <Input
                    config={{
                      onChangeText: (text: string) => setFieldValue('review', text),
                      value: values.review,
                      placeholder: 'Write a review',
                      multiline: true,
                      numberOfLines: 4,
                    }}
                    style={{ height: 100, alignItems: 'flex-start' }}
                  />
                </FormItem>
              </>
            )}

            {/* TODO: delete book */}
            <View style={styles.buttons}>
              <CustomButton
                type='primary'
                label='Save'
                onPress={submitForm}
                loading={isSubmitting}
              />
              <CustomButton type='secondary' label='Cancel' onPress={() => navigation.goBack()} />
            </View>
          </>
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
    backgroundColor: COLORS.white,
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
  buttons: {
    marginVertical: 20,
    gap: 16,
  },
})
