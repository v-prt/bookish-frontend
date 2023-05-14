import { ReactNode, FC, createContext, useState, useEffect } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'

export const SearchContext = createContext<any>(null)

interface Props {
  children: ReactNode
}

export const SearchProvider: FC<Props> = ({ children }) => {
  // regular search
  const [searchText, setSearchText] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any>([])
  const [totalResults, setTotalResults] = useState<number | null>(null)

  // genre search
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [genreSearchText, setGenreSearchText] = useState<string>('')
  const [genreSearchResults, setGenreSearchResults] = useState<any>([])
  const [totalGenreResults, setTotalGenreResults] = useState<number | null>(null)

  const maxResults = 20

  const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['search-results', searchText],
    async ({ pageParam = 0 }) => {
      if (searchText?.length > 0) {
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${searchText}&startIndex=${pageParam}&maxResults=${maxResults}`
        )

        const items = res.data.items
        const totalItems = res.data.totalItems
        return { items, totalItems }
      } else return { items: [], totalItems: 0 }
    },
    {
      getNextPageParam: (lastPage, pages) => {
        const currentCount = pages.flatMap(page => page?.items).length
        return currentCount < lastPage?.totalItems ? currentCount + maxResults : undefined
      },
    }
  )

  const {
    data: genreSearchData,
    status: genreSearchStatus,
    fetchNextPage: fetchNextGenreSearchPage,
    isFetchingNextPage: isFetchingNextGenreSearchPage,
  } = useInfiniteQuery(
    ['genre-search-results', genreSearchText],
    async ({ pageParam = 0 }) => {
      if (genreSearchText?.length > 0) {
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${genreSearchText}&startIndex=${pageParam}&maxResults=${maxResults}`
        )

        const items = res.data.items
        const totalItems = res.data.totalItems
        return { items, totalItems }
      } else return { items: [], totalItems: 0 }
    },
    {
      getNextPageParam: (lastPage, pages) => {
        const currentCount = pages.flatMap(page => page?.items).length
        return currentCount < lastPage?.totalItems ? currentCount + maxResults : undefined
      },
    }
  )

  const filterBooks = (pages: any[]) => {
    // remove duplicates and books without images
    const books = pages.flatMap(page => page?.items || [])
    const uniqueBooks = Array.from(new Set(books.map((book: any) => book.id))).map(id => {
      const filteredBooks = books.filter(book => book.id === id)
      const book = filteredBooks[0]
      return {
        volumeId: book.id,
        title: book.volumeInfo.title,
        image: book.volumeInfo.imageLinks?.thumbnail,
        author: book.volumeInfo.authors?.[0],
        averageRating: book.volumeInfo.averageRating,
        ratingsCount: book.volumeInfo.ratingsCount,
      }
    })
    const booksWithImages = uniqueBooks.filter((book: any) => book.image !== undefined)
    return booksWithImages
  }

  useEffect(() => {
    if (status === 'success' && data) {
      const searchResults = filterBooks(data.pages)
      setSearchResults(searchResults)
      setTotalResults(data.pages[0]?.totalItems)
    }
  }, [status, data])

  useEffect(() => {
    if (genreSearchStatus === 'success' && genreSearchData) {
      const genreSearchResults = filterBooks(genreSearchData.pages)
      setGenreSearchResults(genreSearchResults)
      setTotalGenreResults(genreSearchData.pages[0]?.totalItems)
    }
  }, [genreSearchStatus, genreSearchData])

  const handleLoadMore = () => {
    fetchNextPage()
  }

  const handleLoadMoreGenreResults = () => {
    fetchNextGenreSearchPage()
  }

  return (
    <SearchContext.Provider
      value={{
        // regular search
        status,
        searchText,
        setSearchText,
        searchResults,
        setSearchResults,
        totalResults,
        setTotalResults,
        handleLoadMore,
        isFetchingNextPage,

        // genre search
        genreSearchStatus,
        genreSearchText,
        setGenreSearchText,
        selectedGenre,
        setSelectedGenre,
        genreSearchResults,
        totalGenreResults,
        setGenreSearchResults,
        handleLoadMoreGenreResults,
        isFetchingNextGenreSearchPage,
      }}>
      {children}
    </SearchContext.Provider>
  )
}
