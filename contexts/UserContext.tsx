import { createContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'

import * as SecureStore from 'expo-secure-store'
import * as Haptics from 'expo-haptics'

const storeToken = async (key: string, value: any) => {
  await SecureStore.setItemAsync(key, value)
}

const deleteToken = async (key: string) => {
  await SecureStore.deleteItemAsync(key)
}

export const UserContext = createContext<any>(null)

interface Props {
  children: React.ReactNode
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const { data: userData, status: userStatus } = useQuery(['user', userId], async () => {
    if (userId) {
      const { data } = await axios.get(`${API_URL}/users/${userId}`)
      return data.user
    } else return null
  })

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync('bookishToken')
      setToken(token)
    }
    getToken()
  }, [])

  // SIGNUP
  const handleSignup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    try {
      const data = { firstName, lastName, email, password }
      const res = await axios.post(`${API_URL}/users`, data)
      storeToken('bookishToken', res.data.token)
      setToken(res.data.token)
      return res.data
    } catch (err) {
      return { error: err }
    }
  }

  // LOGIN
  const handleLogin = async (email: string, password: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    try {
      const data = { email, password }
      const res = await axios.post(`${API_URL}/login`, data)
      storeToken('bookishToken', res.data.token)
      setToken(res.data.token)
      return res.data
    } catch (err) {
      return { error: err }
    }
  }

  // VERIFY TOKEN AND SET CURRENT USER ID
  const verifyToken = async (token: string) => {
    try {
      const res = await axios.post(`${API_URL}/token`, { token })
      if (res.status === 200) {
        setUserId(res.data.user._id)
      } else {
        // something wrong with token
        deleteToken('bookishToken')
        setUserId(null)
      }
    } catch (err) {
      // something wrong with token
      deleteToken('bookishToken')
      setUserId(null)
    }
  }

  useEffect(() => {
    if (token) {
      verifyToken(token)
    }
  }, [token])

  // LOGOUT
  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    deleteToken('bookishToken')
    setUserId(null)
  }

  return (
    <UserContext.Provider
      value={{
        token,
        userId,
        userData,
        userStatus,
        handleSignup,
        handleLogin,
        handleLogout,
      }}>
      {children}
    </UserContext.Provider>
  )
}
