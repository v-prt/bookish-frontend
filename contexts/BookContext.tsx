import { createContext, FC, ReactNode } from 'react'
import { useQueryClient } from 'react-query'

import axios from 'axios'
import { API_URL } from '../constants'

export const BookContext = createContext<any>(null)

interface Props {
  children: ReactNode
}

export const BookProvider: FC<Props> = ({ children }) => {
  const queryClient = useQueryClient()

  const fetchBook = async (userId: string, volumeId: string) => {
    const { data } = await axios.get(`${API_URL}/books/${userId}/${volumeId}`)
    return data.book
  }

  const addBook = async (book: any) => {
    const { data } = await axios.post(`${API_URL}/books`, book)
    queryClient.invalidateQueries('user')
    queryClient.invalidateQueries('user-book')
    queryClient.invalidateQueries('currently-reading')
    queryClient.invalidateQueries('want-to-read')
    queryClient.invalidateQueries('read')
    return data.newBook
  }

  const updateBook = async (bookId: any, book: any) => {
    const { data } = await axios.put(`${API_URL}/books/${bookId}`, book)
    queryClient.invalidateQueries('user')
    queryClient.invalidateQueries('user-book')
    queryClient.invalidateQueries('currently-reading')
    queryClient.invalidateQueries('want-to-read')
    queryClient.invalidateQueries('read')
    return data.updatedBook
  }

  const fetchBookshelf = async (userId: string, bookshelf: string) => {
    const { data } = await axios.get(`${API_URL}/bookshelf/${userId}`, {
      params: { bookshelf },
    })
    return data
  }

  const deleteBook = async (bookId: string) => {
    const { data } = await axios.delete(`${API_URL}/books/${bookId}`)
    queryClient.invalidateQueries('user')
    queryClient.invalidateQueries('user-book')
    queryClient.invalidateQueries('currently-reading')
    queryClient.invalidateQueries('want-to-read')
    queryClient.invalidateQueries('read')
    return data
  }

  return (
    <BookContext.Provider value={{ fetchBook, addBook, updateBook, fetchBookshelf, deleteBook }}>
      {children}
    </BookContext.Provider>
  )
}
