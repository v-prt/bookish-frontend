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
  const queryKeys = [
    'user',
    'user-book',
    'owned',
    'currently-reading',
    'want-to-read',
    'read',
    'reading-activity',
    'recommended-books',
    'bookshelf-summaries',
  ]

  const fetchBook = async (userId: string, volumeId: string) => {
    const { data } = await axios.get(`${API_URL}/books/${userId}/${volumeId}`)
    return data.book
  }

  const addBook = async (book: any) => {
    const { data } = await axios.post(`${API_URL}/books`, book)
    queryKeys.forEach(key => queryClient.invalidateQueries(key))
    return data.newBook
  }

  const updateBook = async (bookId: any, book: any) => {
    const { data } = await axios.put(`${API_URL}/books/${bookId}`, book)
    queryKeys.forEach(key => queryClient.invalidateQueries(key))
    return data.updatedBook
  }

  const deleteBook = async (bookId: string) => {
    const { data } = await axios.delete(`${API_URL}/books/${bookId}`)
    queryKeys.forEach(key => queryClient.invalidateQueries(key))
    return data
  }

  return (
    <BookContext.Provider value={{ fetchBook, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  )
}
