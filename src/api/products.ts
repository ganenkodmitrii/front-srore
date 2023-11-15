import { createQueryKeys } from '@lukemorales/query-key-factory'
import queryString from 'query-string'

import models from '@/src/models'

import { mainAxios } from './axios'

export const products = {
  getPaginated: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.WithResults<models.Product>>(
      queryString.stringifyUrl({ url: '/products', query: queryParams }),
    )
    return data
  },
  getBySlug: async (slug: string) => {
    const { data } = await mainAxios.get<models.Product>(`/products/${slug}`)
    return data
  },
  getFavorites: async () => {
    const { data } = await mainAxios.get<models.Product[]>('/products/all-favorites')
    return data
  },
  postFavoriteById: async (id: number) => {
    const { data } = await mainAxios.post<models.Product>(`/products/favorites`, { product: id })
    return data
  },
  postFavoriteBulk: async (ids: string) => {
    const { data } = await mainAxios.post('/products/favorites/bulk', { products_ids: ids.split(',') })
    return data
  },
  deleteFavoriteById: async (id: number) => {
    await mainAxios.delete<models.Product>(`/products/favorites/${id}`)
  },
  deleteFavoriteBulk: async (ids: number[] | undefined) => {
    await mainAxios.delete(`/products/favorites?ids=${ids?.join()}`, {
      headers: { 'X-BULK-OPERATION': true },
    })
  },
}

export const productsQueries = createQueryKeys('products', {
  getPaginated: (params = {}) => ({
    queryKey: [params],
    queryFn: () => products.getPaginated(params),
  }),
  getBySlug: (slug) => ({
    queryKey: [slug],
    queryFn: () => products.getBySlug(slug),
  }),
  getFavorites: () => ({
    queryKey: ['all-favorites'],
    queryFn: () => products.getFavorites(),
  }),
  postFavoriteById: (id) => ({
    queryKey: [id],
    queryFn: () => products.postFavoriteById(id),
  }),
  deleteFavoriteById: (id) => ({
    queryKey: [id],
    queryFn: () => products.deleteFavoriteById(id),
  }),
})
