import { createContext } from 'react'
import { useQuery, useQueryClient } from 'react-query'

import axios from 'axios'
import { API_URL } from '../constants'

export const BookContext = createContext<any>(null)

interface Props {
  children: React.ReactNode
}

export const BookProvider: React.FC<Props> = ({ children }) => {
  const queryClient = useQueryClient()

  const fetchBook = async (userId: string, volumeId: string) => {
    console.log(userId, volumeId)
    const { data } = await axios.get(`${API_URL}/books/${userId}/${volumeId}`)
    return data.book
  }

  return <BookContext.Provider value={{ fetchBook }}>{children}</BookContext.Provider>
}
