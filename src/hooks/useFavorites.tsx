import { useContext } from 'react'

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { FavoritesContext, UserContext } from '@/src/contexts'
import models from '@/src/models'

export const useFavorites = (queryKey: readonly string[], infiniteQuery?: boolean) => {
  const queryClient = useQueryClient()
  const { user } = useContext(UserContext)
  const { favorites, setFavorites } = useContext(FavoritesContext)
  const previousProducts:
    | (models.WithResults<models.Product> & InfiniteData<models.WithResults<models.Product>>)
    | undefined = queryClient.getQueryData(queryKey)

  const setFavoriteCacheData = async (state: boolean, id: number) => {
    await queryClient.cancelQueries(queryKey)
    queryClient.setQueryData(queryKey, () => {
      return {
        ...previousProducts,
        results: previousProducts?.results.map((product: models.Product) => {
          if (state) return product.id === id ? { ...product, favorite: true } : product
          return product.favorite?.id === id ? { ...product, favorite: null } : product
        }),
      }
    })
    return { previousProducts }
  }

  const setFavoriteInfiniteCacheData = async (state: boolean, id: number) => {
    await queryClient.cancelQueries(queryKey)
    queryClient.setQueryData(queryKey, () => {
      const newPages = previousProducts?.pages?.map((page: models.WithResults<models.Product>) => {
        return {
          ...previousProducts,
          results: page.results.map((product: models.Product) => {
            if (state) {
              return product.id === id ? { ...product, favorite: true } : product
            } else {
              return product.favorite?.id === id ? { ...product, favorite: null } : product
            }
          }),
        }
      })

      return {
        ...previousProducts,
        pages: newPages,
      }
    })
    return { previousProducts }
  }

  const postFavoriteMutation = useMutation({
    mutationFn: (id: number) => api.products.postFavoriteById(id),
    onMutate: (id: number) => (infiniteQuery ? setFavoriteInfiniteCacheData(true, id) : setFavoriteCacheData(true, id)),
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousProducts)
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey)
      const favoritesQueryKey = queries.products.getFavorites().queryKey
      queryClient.invalidateQueries(favoritesQueryKey)
    },
  })
  const deleteFavoriteMutation = useMutation({
    mutationFn: (id: number) => api.products.deleteFavoriteById(id),
    onMutate: (id: number) =>
      infiniteQuery ? setFavoriteInfiniteCacheData(false, id) : setFavoriteCacheData(false, id),
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousProducts)
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey)
      const favoritesQueryKey = queries.products.getFavorites().queryKey
      queryClient.invalidateQueries(favoritesQueryKey)
    },
  })

  const onFavoriteIconClick = (product: models.Product) => {
    const isChecked = isFavorite(product)
    const id = product.favorite !== null ? product.favorite.id : product.id
    if (user) return isChecked ? deleteFavoriteMutation.mutate(id) : postFavoriteMutation.mutate(id)

    if (isChecked) {
      setFavorites((prev) => prev.filter((elem) => elem !== id.toString()))
    } else {
      setFavorites([...favorites, id.toString()])
    }
  }

  const isFavorite = (product: models.Product) => {
    return !!product.favorite || favorites.indexOf(product.id.toString()) > -1
  }

  return {
    onFavoriteIconClick,
    isFavorite,
  }
}
