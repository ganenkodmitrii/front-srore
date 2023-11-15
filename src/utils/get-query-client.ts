import { cache } from 'react'

import { QueryClient } from '@tanstack/react-query'

export const getQueryClient = cache(() => new QueryClient())

export const defaultOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 5000,
    },
  },
}
