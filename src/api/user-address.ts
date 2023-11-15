import { createQueryKeys } from '@lukemorales/query-key-factory'
import queryString from 'query-string'

import models from '@/src/models'

import { mainAxios } from './axios'

export const userAddress = {
  getPaginated: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.WithResults<models.UserAccountAddress>>(
      queryString.stringifyUrl({ url: '/users/addresses', query: queryParams }),
    )
    return data
  },
  getById: async (id: number) => {
    const { data } = await mainAxios.get<models.UserAccountAddress>(`/users/addresses/${id}`)
    return data
  },
  create: async (data: models.FormData<models.UserAccountAddress>) => {
    const response = await mainAxios.post('/users/addresses', data)
    return response.data
  },
  update: async (id: number, data: models.FormData<models.UserAccountAddress>) => {
    const response = await mainAxios.patch(`/users/addresses/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await mainAxios.delete(`/users/addresses/${id}`)
    return response.data
  },
}

export const userAddressQueries = createQueryKeys('user-address', {
  getPaginated: (params = {}) => ({
    queryKey: [params],
    queryFn: () => userAddress.getPaginated(params),
  }),

  getById: (id) => ({
    queryKey: [id],
    queryFn: () => userAddress.getById(id),
  }),
})
