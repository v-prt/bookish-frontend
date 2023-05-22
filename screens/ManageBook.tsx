import { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, Pressable, Alert, SafeAreaView, Modal } from 'react-native'
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
import { IconButton } from '../ui/IconButton'

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
  const { addBook, updateBook, deleteBook } = useContext(BookContext)
  const [removeBookModalVisible, setRemoveBookModalVisible] = useState(false)

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
      navigation.setOptions({
        headerTitle: () => <Text style={styles.headerTitle}>Manage Book</Text>,
      })
    } else {
      navigation.setOptions({
        headerTitle: () => <Text style={styles.headerTitle}>Add Book</Text>,
      })
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
        review: existingBook.review?.text,
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

  const handleDeleteBook = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    try {
      await deleteBook(existingBook._id)
      setRemoveBookModalVisible(false)
      navigation.goBack()
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again later.')
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingBottom: 40,
      }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ values, setFieldValue, status, submitForm, isSubmitting }) => (
          <>
            {status && (
              <AlertText type='error' icon='error' title={`Couldn't save book`} subtitle={status} />
            )}
            {/* TODO: show small book cover & title */}
            {/* <Text style={styles.title}>
              {book.title}
            </Text> */}
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
                  <View style={styles.formRow}>
                    <View style={styles.labelWrapper}>
                      <MaterialIcons name='calendar-today' color={COLORS.primary700} size={20} />
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

                <FormItem name='rating'>
                  <View style={styles.formRow}>
                    <Text style={styles.labelText}>Rating</Text>
                    <RatingButtons
                      rating={values.rating}
                      setRating={rating => {
                        setFieldValue('rating', rating)
                      }}
                    />
                  </View>
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

            <View style={styles.buttons}>
              <CustomButton
                type='primary'
                label='Save'
                onPress={submitForm}
                loading={isSubmitting}
              />
            </View>
          </>
        )}
      </Formik>

      {existingBook && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Remove Book...</Text>
            <Pressable onPress={() => setRemoveBookModalVisible(true)}>
              <MaterialIcons name='delete' size={24} color={COLORS.accentLight} />
            </Pressable>
          </View>

          <Modal visible={removeBookModalVisible} animationType='slide'>
            <SafeAreaView style={styles.modalWrapper}>
              <View style={styles.modalInner}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Remove Book</Text>
                  <IconButton
                    icon='close'
                    color={COLORS.primary600}
                    onPress={() => setRemoveBookModalVisible(false)}
                  />
                </View>
                <Text style={styles.confirmationText}>
                  Are you sure you want to remove this book from your library? Any related data
                  including your rating will be permanently deleted.
                </Text>
                <View style={styles.buttons}>
                  <CustomButton type='primary' label='Remove' onPress={handleDeleteBook} />
                  <CustomButton
                    type='secondary'
                    label='Cancel'
                    onPress={() => setRemoveBookModalVisible(false)}
                  />
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </>
      )}
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontFamily: 'RobotoMono-Bold',
    color: COLORS.primary700,
  },
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
    padding: 20,
  },
  options: {
    backgroundColor: COLORS.primary300,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  optionButton: {
    backgroundColor: COLORS.primary200,
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: COLORS.primary100,
  },
  optionText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.primary600,
  },
  selectedText: {
    color: COLORS.accentDark,
  },
  formRow: {
    backgroundColor: COLORS.primary200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 10,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  labelText: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.primary700,
  },
  buttons: {
    marginVertical: 20,
    gap: 16,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
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
  confirmationText: {
    fontFamily: 'RobotoMono-Regular',
    color: COLORS.primary800,
    marginVertical: 30,
    fontSize: 18,
  },
})
