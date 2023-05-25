import { FC, useEffect, useState, useContext, memo } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native'
import { useQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { BookContext } from '../contexts/BookContext'
import { COLORS } from '../GlobalStyles'
import RenderHtml from 'react-native-render-html'
import { MaterialIcons } from '@expo/vector-icons'
import { ImageLoader } from '../ui/ImageLoader'
import moment from 'moment'
import { Avatar } from '../ui/Avatar'
import { IconButton } from '../ui/IconButton'

interface Props {
  navigation: any
  route: any
}

export const BookDetails: FC<Props> = ({
  navigation,
  route: {
    params: { volumeId },
  },
}: any) => {
  const { userData, userId } = useContext(UserContext)
  const { fetchBook } = useContext(BookContext)
  const [book, setBook] = useState<any>(null)
  const [genres, setGenres] = useState<string | null>(null)

  const { data: googleBookData, status: googleBookStatus } = useQuery(
    ['google-book', volumeId],
    () => fetch(`https://www.googleapis.com/books/v1/volumes/${volumeId}`).then(res => res.json())
  )

  const { data: userBookData } = useQuery(['user-book', volumeId], () =>
    fetchBook(userId, volumeId)
  )

  const actionBtnStyles = userBookData
    ? [styles.actionBtn, styles.primaryActionBtn]
    : [styles.actionBtn, styles.secondaryActionBtn]

  const actionTextStyles = userBookData
    ? [styles.actionText, styles.primaryActionText]
    : [styles.actionText, styles.secondaryActionText]

  useEffect(() => {
    if (googleBookData) {
      setBook(googleBookData.volumeInfo)
    }
  })

  useEffect(() => {
    if (book?.categories?.length > 0) {
      // clean up categories (remove slashes and duplicate words)
      let cats = [
        ...new Set(book.categories.map((string: string) => string.split(' / ')).flat()),
      ] as string[]

      // create a text string with all categories separated by a comma
      let text = cats.map((string: string) => string).join(', ') as string

      setGenres(text)
    }
  }, [book])

  const renderStars = (rating: number) => {
    let stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={
            rating > i + 0.5 ? 'star' : rating > i && rating < i + 1 ? 'star-half' : 'star-border'
          }
          size={18}
          color={rating > i ? COLORS.accentLight : COLORS.primary500}
        />
      )
    }
    return stars
  }

  const DescriptionDisplay = memo(function DescriptionDisplay() {
    // using memo to prevent re-rendering unnecessarily (warning occurs from RenderHtml)
    const { width: contentWidth } = useWindowDimensions()
    const baseStyle = {
      fontFamily: 'RobotoMono-Regular',
      fontSize: 14,
      color: COLORS.primary700,
      marginBottom: 10,
    }
    const systemFonts = ['RobotoMono-Regular']
    return (
      <RenderHtml
        contentWidth={contentWidth}
        source={{ html: book.description }}
        baseStyle={baseStyle}
        systemFonts={systemFonts}
      />
    )
  })

  return (
    <View style={styles.screen}>
      {(googleBookStatus === 'loading' || !book) && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary400} />
        </View>
      )}

      {googleBookStatus === 'success' && book && (
        <ScrollView style={styles.book} showsVerticalScrollIndicator={false}>
          <View style={styles.basicInfo}>
            <ImageLoader
              style={styles.image}
              source={{ uri: book.imageLinks?.thumbnail }}
              borderRadius={10}
            />
            <View style={styles.text}>
              <Text style={styles.title}>{book.title}</Text>
              {book.subtitle && <Text style={styles.subtitle}>{book.subtitle}</Text>}
              <Text style={styles.author}>by {book.authors?.join(', ')}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() =>
                navigation.navigate('ManageBook', {
                  book: {
                    volumeId,
                    title: book.title,
                    author: book.authors?.[0],
                    image: book.imageLinks?.thumbnail,
                  },
                  existingBook: userBookData,
                })
              }
              style={actionBtnStyles}>
              <Text style={actionTextStyles}>
                {userBookData?.bookshelf || 'Add to Library'}
                {userBookData?.owned && ' (Owned)'}
              </Text>
              <MaterialIcons
                name='expand-more'
                color={userBookData ? COLORS.white : COLORS.accentLight}
                size={24}
              />
            </Pressable>
          </View>

          <View style={styles.ratings}>
            <View style={styles.ratingGroup}>
              <MaterialIcons
                name={book.averageRating ? 'star' : 'star-border'}
                color={book.averageRating ? 'gold' : COLORS.primary500}
                size={20}
              />
              <Text style={styles.ratingValue}>
                {book.averageRating ? `${book.averageRating}/5` : '-'}
              </Text>
              <Text style={styles.ratingsSublabel}>
                ({book.ratingsCount?.toLocaleString() || 0} rating{book.ratingsCount !== 1 && 's'})
              </Text>
            </View>
            <View style={styles.ratingGroup}>
              <MaterialIcons
                name={userBookData?.rating ? 'star' : 'star-border'}
                color={userBookData?.rating ? COLORS.accentLight : COLORS.primary500}
                size={20}
              />
              <Text style={styles.ratingValue}>
                {userBookData?.rating ? `${userBookData?.rating}/5` : '-'}
              </Text>
              <Text style={styles.ratingsSublabel}>(Your rating)</Text>
            </View>
          </View>

          <View style={styles.details}>
            {userBookData?.review && (
              <>
                {/* TODO: fetch all books from db with this volumeId and display other users' reviews (use FlatList and paginate), keep current user's own review at top */}
                <Text style={styles.headerText}>Reviews</Text>
                <View style={styles.divider} />
                <View style={styles.reviewSection}>
                  <Avatar
                    initials={`${userData.firstName[0]}${userData.lastName[0]}`}
                    size='small'
                  />
                  <View>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.name}>{userData.firstName}</Text>
                      <View style={styles.stars}>{renderStars(userBookData.rating)}</View>
                    </View>
                    <Text style={styles.reviewDate}>
                      {moment(userBookData?.review?.date).format('lll')}
                    </Text>
                    <Text style={styles.reviewText}>{userBookData?.review?.text}</Text>
                  </View>
                  <View style={styles.editReviewBtn}>
                    <IconButton
                      icon='edit'
                      size={20}
                      color={COLORS.primary600}
                      onPress={() =>
                        navigation.navigate('ManageBook', {
                          volumeId,
                          existingBook: userBookData,
                        })
                      }
                    />
                  </View>
                </View>
              </>
            )}

            <Text style={styles.headerText}>Description</Text>
            <View style={styles.divider} />
            <View style={styles.description}>
              <DescriptionDisplay />
            </View>

            <Text style={styles.headerText}>Details</Text>
            <View style={styles.divider} />
            <Text style={styles.detailsText}>
              <Text style={styles.label}>Genres: </Text>
              {genres || 'Unknown'}
            </Text>
            <Text style={styles.detailsText}>
              <Text style={styles.label}>Publisher: </Text>
              {book.publisher || 'Unknown'}
            </Text>
            <Text style={styles.detailsText}>
              <Text style={styles.label}>Published: </Text>
              {book.publishedDate ? moment(book.publishedDate).format('LL') : 'Unknown'}
            </Text>
            <Text style={styles.detailsText}>
              <Text style={styles.label}>Pages: </Text>
              {book.pageCount || 'Unknown'}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary100,
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  book: {
    flex: 1,
  },
  basicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  text: {
    maxWidth: '60%',
  },
  image: {
    backgroundColor: COLORS.primary200,
    borderRadius: 10,
    height: 150,
    aspectRatio: 2 / 3,

    // android shadow
    elevation: 4,
    // ios shadow
    shadowColor: COLORS.primary900,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  title: {
    color: COLORS.accentDark,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 20,
  },
  subtitle: {
    color: COLORS.accentDark,
    fontSize: 16,
    fontFamily: 'RobotoMono-Italic',
  },
  author: {
    fontFamily: 'RobotoMono-Regular',
    color: COLORS.primary600,
    fontSize: 17,
    marginTop: 5,
  },
  ratings: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 20,
  },
  ratingGroup: {
    alignItems: 'center',
  },
  ratingValue: {
    fontFamily: 'RobotoMono-Bold',
    color: COLORS.primary600,
    fontSize: 22,
    height: 24,
  },
  ratingsSublabel: {
    color: COLORS.primary500,
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
  },

  actions: {
    paddingHorizontal: 20,
  },
  actionBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.accentLight,
    borderColor: COLORS.accentLight,
  },
  secondaryActionBtn: {
    backgroundColor: COLORS.primary100,
    borderColor: COLORS.accentLight,
  },
  actionText: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
  },
  primaryActionText: {
    color: COLORS.white,
  },
  secondaryActionText: {
    color: COLORS.accentLight,
  },

  details: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    // android shadow
    elevation: 4,
    // ios shadow
    shadowColor: COLORS.primary700,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  headerText: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 20,
    color: COLORS.accentDark,
    marginBottom: 8,
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.accentDark,
    marginBottom: 20,
    opacity: 0.6,
  },
  description: {
    marginBottom: 30,
  },
  detailsText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.primary700,
    marginBottom: 10,
  },
  label: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
  },

  reviewSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary300,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
    color: COLORS.accentLight,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  reviewDate: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
    color: COLORS.primary500,
    marginBottom: 8,
  },
  reviewText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.primary700,
  },
  editReviewBtn: {
    marginLeft: 'auto',
  },
})
