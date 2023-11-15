import { createQueryKeys } from '@lukemorales/query-key-factory'
import queryString from 'query-string'

import models from '@/src/models'

import { mainAxios } from './axios'

export const categories = {
  getPaginated: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.WithResults<models.Category>>(
      queryString.stringifyUrl({ url: '/categories', query: queryParams }),
    )
    return data
  },
  getAll: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.Category[]>(
      queryString.stringifyUrl({ url: '/categories/all', query: queryParams }),
    )
    return data
  },
  getById: async (id: number) => {
    const { data } = await mainAxios.get<models.Category>(`/categories/${id}`)
    return data
  },
}

export const categoriesQueries = createQueryKeys('categories', {
  getPaginated: (params = {}) => ({
    queryKey: [params],
    queryFn: () => categories.getPaginated(params),
  }),
  getAll: (params = {}) => ({
    queryKey: [params],
    queryFn: () => categories.getAll(params),
  }),
  getById: (id) => ({
    queryKey: [id],
    queryFn: () => categories.getById(id),
  }),
})
