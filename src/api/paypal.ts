import { createQueryKeys } from '@lukemorales/query-key-factory'
import i18next from 'i18next'

import models from '@/src/models'

import { mainAxios } from './axios'

export const paypal = {
  create: async (body: models.Cart) => {
    const { data } = await mainAxios.post('/paypal', body)
    return data
  },
  get: async (paypal_order_id: string) => {
    const { data } = await mainAxios.get(`/paypal/${paypal_order_id}`)
    return data
  },
  capture: async (custom_id: string, paypal_order_id: string) => {
    const { data } = await mainAxios.post(`/paypal/${paypal_order_id}/capture`, {
      custom_id,
      order_url: `${process.env.NEXT_PUBLIC_DOMAIN}/${i18next.language}/orders/{uid}`,
    })
    return data
  },
}

export const paypalQueries = createQueryKeys('paypal', {
  get: (paypal_order_id: string) => ({
    queryKey: ['get', paypal_order_id],
    queryFn: () => paypal.get(paypal_order_id),
  }),
})
