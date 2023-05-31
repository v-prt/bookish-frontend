import { ReactNode, FC, createContext, useState, useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import { UserContext } from './UserContext'
import { API_URL } from '../constants'

export const SearchContext = createContext<any>(null)

interface Props {
  children: ReactNode
}

export const SearchProvider: FC<Props> = ({ children }) => {
  const { userId } = useContext(UserContext)
  const [searchText, setSearchText] = useState<string>('')
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [genreSearchText, setGenreSearchText] = useState<string>('')

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['search-results', searchText],
    async ({ pageParam }) => {
      if (userId && searchText?.length > 0) {
        const { data } = await axios.get(`${API_URL}/google-books/${userId}`, {
          params: {
            searchText,
            pageParam,
          },
        })

        return data
      } else return null
    },
    {
      getNextPageParam: lastPage => lastPage?.nextPage,
    }
  )

  const {
    data: genreSearchData,
    status: genreSearchStatus,
    hasNextPage: genreSearchHasNextPage,
    fetchNextPage: fetchNextGenreSearchPage,
    isFetchingNextPage: isFetchingNextGenreSearchPage,
  } = useInfiniteQuery(
    ['genre-search-results', genreSearchText],
    async ({ pageParam = 0 }) => {
      if (userId && genreSearchText?.length > 0) {
        const { data } = await axios.get(`${API_URL}/google-books/${userId}`, {
          params: {
            searchText: genreSearchText,
            pageParam,
          },
        })

        return data
      } else return null
    },
    {
      getNextPageParam: lastPage => lastPage?.nextPage,
    }
  )

  const handleInfiniteScroll = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleInfiniteGenreSearchScroll = () => {
    if (genreSearchHasNextPage && !isFetchingNextGenreSearchPage) {
      fetchNextGenreSearchPage()
    }
  }

  return (
    <SearchContext.Provider
      value={{
        // regular search
        data,
        status,
        searchText,
        setSearchText,
        handleInfiniteScroll,
        isFetchingNextPage,

        // genre search
        genreSearchData,
        genreSearchStatus,
        genreSearchText,
        setGenreSearchText,
        selectedGenre,
        setSelectedGenre,
        handleInfiniteGenreSearchScroll,
        isFetchingNextGenreSearchPage,
      }}>
      {children}
    </SearchContext.Provider>
  )
}
