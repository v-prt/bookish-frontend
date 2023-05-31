import { FC, useEffect, useState, useContext, memo } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Pressable,
  FlatList,
} from 'react-native'
import { useInfiniteQuery, useQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import { UserContext } from '../contexts/UserContext'
import { BookContext } from '../contexts/BookContext'
import { COLORS } from '../GlobalStyles'
import RenderHtml from 'react-native-render-html'
import { MaterialIcons } from '@expo/vector-icons'
import { ImageLoader } from '../ui/ImageLoader'
import moment from 'moment'
import { ReviewCard } from '../components/ReviewCard'

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
  const { userId } = useContext(UserContext)
  const { fetchBook } = useContext(BookContext)
  const [book, setBook] = useState<any>(null)
  const [genres, setGenres] = useState<string | null>(null)
  const [totalReviews, setTotalReviews] = useState(undefined)
  const [reviews, setReviews] = useState<any[]>([])

  const { data: googleBookData, status: googleBookStatus } = useQuery(
    ['google-book', volumeId],
    () => fetch(`https://www.googleapis.com/books/v1/volumes/${volumeId}`).then(res => res.json())
  )

  const { data: userBookData } = useQuery(['user-book', volumeId], () =>
    fetchBook(userId, volumeId)
  )

  const {
    data: reviewsData,
    status: reviewsStatus,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['reviews', volumeId],
    async ({ pageParam }) => {
      const { data } = await axios.get(`${API_URL}/reviews/${volumeId}/${pageParam || 1}`)

      return data
    },
    {
      getNextPageParam: lastPage => lastPage?.nextPage,
    }
  )

  useEffect(() => {
    if (reviewsStatus === 'success' && reviewsData) {
      setTotalReviews(reviewsData?.pages?.[0]?.totalReviews)
      setReviews(
        reviewsData.pages
          .map((page: { reviews: any[] }) => page.reviews.map((review: any) => review))
          .flat()
      )
    }
  }, [reviewsStatus, reviewsData])

  const handleInfiniteScroll = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

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
    navigation.setOptions({
      headerTitle: book?.title,
      // header font
      headerTitleStyle: {
        fontFamily: 'RobotoMono-Bold',
        fontSize: 16,
      },
    })
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
            <Text style={actionTextStyles}>{userBookData?.bookshelf || 'Add to Library'}</Text>
            <MaterialIcons
              name='expand-more'
              color={userBookData ? COLORS.white : COLORS.accentLight}
              size={24}
            />
          </Pressable>

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

          <View style={styles.bookInfoWrapper}>
            <Text style={styles.headerText}>Description</Text>
            <View style={styles.divider} />
            <View style={styles.description}>
              <DescriptionDisplay />
            </View>

            <Text style={styles.headerText}>Details</Text>
            <View style={styles.divider} />
            <View style={styles.details}>
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

            <Text style={styles.headerText}>Reviews</Text>
            <View style={styles.divider} />
            {reviewsStatus === 'loading' &&
              [...Array(6)].map((_, i) => (
                <View style={[styles.skelement, i === 5 && { marginRight: 20 }]} key={i} />
              ))}
            {reviewsStatus === 'success' &&
              (totalReviews && reviews?.length ? (
                <FlatList
                  data={reviews}
                  keyExtractor={review => review.userId._id}
                  renderItem={({ item, index }) => (
                    <ReviewCard
                      key={item.id}
                      review={{
                        ...item,
                        user: {
                          firstName: item.userId.firstName,
                          lastName: item.userId.lastName,
                        },
                      }}
                      lastChild={index === reviews.length - 1}
                    />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  onEndReachedThreshold={0.2}
                  onEndReached={handleInfiniteScroll}
                  style={styles.reviews}
                  ListFooterComponent={() => {
                    if (isFetchingNextPage) {
                      return (
                        <View style={styles.footerContainer}>
                          <ActivityIndicator size='small' color={COLORS.primary400} />
                        </View>
                      )
                    } else {
                      return null
                    }
                  }}
                />
              ) : (
                <View style={styles.blankSpace}>
                  <MaterialIcons name='book' size={40} color='#ccc' />
                  <Text style={styles.infoText}>No Reviews</Text>
                </View>
              ))}
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
    color: COLORS.primary900,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 20,
  },
  subtitle: {
    color: COLORS.primary900,
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
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
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

  bookInfoWrapper: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
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
    marginLeft: 20,
    marginBottom: 8,
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.accentDark,
    marginLeft: 20,
    marginBottom: 20,
    opacity: 0.6,
  },
  details: {
    marginBottom: 20,
  },
  reviews: {
    marginBottom: 20,
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingRight: 30,
    flex: 1,
  },
  description: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  detailsText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 16,
    color: COLORS.primary700,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  label: {
    fontFamily: 'RobotoMono-Bold',
    fontSize: 16,
  },

  skelement: {
    height: 120,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  blankSpace: {
    height: 120,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginHorizontal: 20,
  },
  infoText: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 14,
    color: COLORS.grey,
  },
})
