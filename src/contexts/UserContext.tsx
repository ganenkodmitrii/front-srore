'use client'
import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/src/app-constants'
import models from '@/src/models'

interface UserContextInterface {
  user: models.User | undefined
  isAuth?: boolean
  isLoading: boolean
  setIsAuth: React.Dispatch<boolean | undefined>
  setUser: React.Dispatch<models.User | undefined>
  logout: () => void
}

interface UserContextProviderProps {
  children: React.ReactNode
}

const userContextDefault = {
  user: undefined,
  isAuth: undefined,
  isLoading: true,
  setIsAuth: () => undefined,
  setUser: () => undefined,
  logout: () => undefined,
}

export const UserContext = React.createContext<UserContextInterface>(userContextDefault)

export const useAuth = () => {
  const context = React.useContext(UserContext)
  if (!context) {
    throw new Error('useAuth must be used within a UserContextProvider')
  }
  return context
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isAuth, setIsAuth] = React.useState<boolean>()
  const [user, setUser] = React.useState<models.User | undefined>()
  const [isLoading, setIsLoading] = React.useState(true)
  const { queryKey, queryFn } = queries.profile.get()

  useQuery(queryKey, queryFn, {
    onSuccess: (data) => setUser(data),
    onError: () => {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      setIsAuth(false)
    },
    onSettled: () => setIsLoading(false),
    enabled: !!isAuth,
  })

  const logout = async () => {
    await api.auth.logout()
    setIsAuth(false)
    setUser(undefined)
    queryClient.invalidateQueries(queryKey)
    router.push('/')
  }

  useEffect(() => {
    const hasAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY) !== null

    setIsAuth(hasAccessToken)
    if (!hasAccessToken) setIsLoading(false)
  }, [])

  return (
    <UserContext.Provider value={{ isAuth, user, isLoading, setIsAuth, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}
