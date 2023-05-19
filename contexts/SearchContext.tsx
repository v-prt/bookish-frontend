import { ReactNode, FC, createContext, useState, useEffect, useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import { UserContext } from './UserContext'
import { BookContext } from './BookContext'
import { API_URL } from '../constants'
import { isConstructorTypeNode } from 'typescript'

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
      if (searchText?.length > 0) {
        const { data } = await axios.get(`${API_URL}/google-books/${userId}`, {
          params: {
            searchText,
            pageParam,
          },
        })

        return data
      } else return null
    },
    // FIXME: pages not working properly
    {
      getNextPageParam: lastPage => lastPage?.nextCursor,
    }
  )

  console.log(data)

  const {
    data: genreSearchData,
    status: genreSearchStatus,
    fetchNextPage: fetchNextGenreSearchPage,
    isFetchingNextPage: isFetchingNextGenreSearchPage,
  } = useInfiniteQuery(
    ['genre-search-results', genreSearchText],
    async ({ pageParam = 0 }) => {
      if (genreSearchText?.length > 0) {
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
      getNextPageParam: lastPage => lastPage?.nextCursor,
    }
  )

  const handleInfiniteScroll = () => {
    console.log('hasNextPage', hasNextPage)
    console.log('isFetchingNextPage', isFetchingNextPage)
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
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
        fetchNextGenreSearchPage,
        isFetchingNextGenreSearchPage,
      }}>
      {children}
    </SearchContext.Provider>
  )
}
