import { createQueryKeys } from '@lukemorales/query-key-factory'
import queryString from 'query-string'

import models from '@/src/models'

import { mainAxios } from './axios'

export const cart = {
  get: async () => {
    const { data } = await mainAxios.get<models.CartResponse>('/cart')
    return data
  },

  calculate: async (body: models.Cart) => {
    const { data } = await mainAxios.post<models.CartCalculation>('/cart/calculate', body)
    return data
  },

  products: {
    add: async (body: models.CartProduct) => {
      const { data } = await mainAxios.post('/cart/products', body)
      return data
    },
    update: async ({ id, body }: { id: number; body: { quantity: number } }) => {
      const { data } = await mainAxios.patch(`/cart/products/${id}`, body)
      return data
    },
    remove: async (id: number) => {
      const { data } = await mainAxios.delete(`/cart/products/${id}`)
      return data
    },
    removeBulk: async (ids: number[]) => {
      const { data } = await mainAxios.delete(
        queryString.stringifyUrl({ url: '/cart/products', query: { ids } }, { arrayFormat: 'comma' }),
        { headers: { 'X-BULK-OPERATION': true } },
      )
      return data
    },
    addBulk: async (body: models.CartProduct[]) => {
      const { data } = await mainAxios.post<models.CartProduct[]>('/cart/products/bulk', { products: body })
      return data
    },
  },
}

export const cartQueries = createQueryKeys('cart', {
  get: () => ({
    queryKey: ['get'],
    queryFn: () => cart.get(),
  }),
  calculate: (body: models.Cart) => ({
    queryKey: ['calculate'],
    queryFn: () => cart.calculate(body),
  }),
})
