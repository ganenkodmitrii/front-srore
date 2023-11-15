import { createQueryKeys } from '@lukemorales/query-key-factory'

import { stringifyUrl } from '@/src/utils'

import { cmsAxios } from './axios'

export const contentDelivery = {
  getContentBySlug: async <T = any>(apiName: string, slug: string, depth?: number) => {
    const { data } = await cmsAxios.get<T>(
      stringifyUrl(`/content-type/delivery/${apiName}/by-slug/${slug}/`, { depth }),
    )
    return data
  },
}

export const contentDeliveryQueries = createQueryKeys('content-delivery', {
  getContentBySlug: (queryKey, slug, depth = 1) => ({
    queryKey: [queryKey, slug, depth],
    queryFn: () => contentDelivery.getContentBySlug(queryKey, slug, depth),
  }),
})
