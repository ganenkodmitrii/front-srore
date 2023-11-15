import { createQueryKeys } from '@lukemorales/query-key-factory'
import queryString from 'query-string'

import models from '@/src/models'

import { mainAxios } from './axios'

export const orders = {
  getPaginated: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.WithResults<models.Order>>(
      queryString.stringifyUrl({ url: '/orders', query: queryParams }),
    )
    return data
  },
  getById: async (id: string) => {
    const { data } = await mainAxios.get<models.Order>(`/orders/${id}`)
    return data
  },
  update: async (id: string, data: Partial<models.Order>) => {
    const { data: responseData } = await mainAxios.patch<models.Order>(`/orders/${id}`, data)
    return responseData
  },
}

export const ordersQueries = createQueryKeys('orders', {
  getPaginated: (params: models.GenericObject) => ({
    queryKey: [params],
    queryFn: () => orders.getPaginated(params),
  }),
  getById: (id: string) => ({
    queryKey: [id],
    queryFn: () => orders.getById(id),
  }),
})
