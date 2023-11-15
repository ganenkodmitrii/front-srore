'use client'

import React, { SetStateAction } from 'react'

import { useUpdateEffect } from '@react-hookz/web'

import { FAVORITES_KEY } from '@/src/app-constants'

interface FavoritesContextInterface {
  favorites: string[]
  setFavorites: React.Dispatch<SetStateAction<string[]>>
}

export const FavoritesContext = React.createContext<FavoritesContextInterface>({
  favorites: [],
  setFavorites: () => undefined,
})

export const FavoritesContextProvider = ({ children }: React.PropsWithChildren) => {
  const [favorites, setFavorites] = React.useState<string[]>([])

  React.useEffect(() => {
    setFavorites(localStorage?.getItem(FAVORITES_KEY)?.split(',') || [])
  }, [])

  useUpdateEffect(() => {
    localStorage.setItem(FAVORITES_KEY, favorites.join())
    if (!favorites.length) localStorage.removeItem(FAVORITES_KEY)
  }, [favorites])

  return <FavoritesContext.Provider value={{ favorites, setFavorites }}>{children}</FavoritesContext.Provider>
}
