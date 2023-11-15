import { createQueryKeys } from '@lukemorales/query-key-factory'

import models from '@/src/models'

import { mainAxios } from './axios'

export const profile = {
  get: async () => {
    const { data } = await mainAxios.get<models.User>('/users/me')
    return data
  },
  update: async (credentials: models.FormData<models.User>) => await mainAxios.patch('/users/me', credentials),
  delete: async (current_password: string) =>
    await mainAxios.delete('/users/me', {
      data: {
        current_password: current_password,
      },
    }),
  setPassword: async (credentials: models.SetNewPassword) => await mainAxios.post('/users/set_password', credentials),
  setEmail: async (credentials: models.SetNewEmail) => await mainAxios.post('/users/set_email', credentials),
}

export const profileQueries = createQueryKeys('profile', {
  get: (params = {}) => ({
    queryKey: [params],
    queryFn: () => profile.get(),
  }),
})
