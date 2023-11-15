import models from '@/src/models'

import { mainAxios } from './axios'

export const cash = async (body: models.Cart) => {
  const { data } = await mainAxios.post('/cash', body)
  return data
}
