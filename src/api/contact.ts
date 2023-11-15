import models from '@/src/models'

import { mainAxios } from './axios'

export const contact = {
  post: async (body: models.Message) => {
    const { data } = await mainAxios.post('/users/messages', body)
    return data
  },
}
