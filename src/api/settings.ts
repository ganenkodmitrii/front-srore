import { createQueryKeys } from '@lukemorales/query-key-factory'

import models from '@/src/models'

import { mainAxios } from './axios'

export const settings = {
  all: {
    get: async () => {
      const { data } = await mainAxios.get<models.WithResults<models.Settings>>('/settings')
      return data
    },
  },
  delivery: {
    get: async () => {
      const { data } = await mainAxios.get<models.WithResults<models.DeliverySetting>>('/settings/delivery')
      return data
    },
  },
  office: {
    get: async () => {
      const { data } = await mainAxios.get<models.WithResults<models.AddressSetting>>('/settings/offices')
      return data
    },
    getById: async (id: number) => {
      const { data } = await mainAxios.get<models.AddressSetting>(`/settings/offices/${id}`)
      return data
    },
  },
}

export const settingsQueries = createQueryKeys('settings', {
  getAll: () => ({
    queryKey: ['all'],
    queryFn: () => settings.all.get(),
  }),
  delivery: () => ({
    queryKey: ['deliveries'],
    queryFn: () => settings.delivery.get(),
  }),
  officesGet: () => ({
    queryKey: ['offices'],
    queryFn: () => settings.office.get(),
  }),
  officesGetById: (id: number) => ({
    queryKey: [id],
    queryFn: () => settings.office.getById(id),
  }),
})
