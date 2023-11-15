import { createQueryKeys } from '@lukemorales/query-key-factory'
import queryString from 'query-string'

import models from '@/src/models'

import { mainAxios } from './axios'

export const brands = {
  getPaginated: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.WithResults<models.Brand>>(
      queryString.stringifyUrl({ url: '/brands', query: queryParams }),
    )
    return data
  },
  getAll: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.Brand[]>(
      queryString.stringifyUrl({ url: '/brands/all', query: queryParams }),
    )
    return data
  },
  getById: async (id: number) => {
    const { data } = await mainAxios.get<models.Brand>(`/brands/${id}`)
    return data
  },
}

export const brandsQueries = createQueryKeys('brands', {
  getPaginated: (params: models.GenericObject) => ({
    queryKey: [params],
    queryFn: () => brands.getPaginated(params),
  }),
  getAll: (params: models.GenericObject) => ({
    queryKey: [params],
    queryFn: () => brands.getAll(params),
  }),
  getById: (id) => ({
    queryKey: [id],
    queryFn: () => brands.getById(id),
  }),
})
