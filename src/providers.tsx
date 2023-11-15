'use client'

import { PropsWithChildren, createElement, useMemo, useRef } from 'react'
import { useState } from 'react'

import dynamic from 'next/dynamic'
import { useServerInsertedHTML } from 'next/navigation'

import { createStandaloneToast } from '@chakra-ui/react'

import emotion_createCache, { Options as CacheOptions } from '@emotion/cache'
import { CacheProvider as EmotionCacheProvider } from '@emotion/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { CartProvider, FavoritesContextProvider, UserContextProvider } from '@/src/contexts'
import theme from '@/src/styles/chakra-theme'
import { defaultOptions } from '@/src/utils'

const ChakraProvider: any = dynamic(() => import('@chakra-ui/provider').then((mod) => mod.ChakraProvider), {
  ssr: false,
})

type EmotionCacheOptions = Partial<CacheOptions>
type CacheProviderProps = PropsWithChildren<EmotionCacheOptions>

const createCache = ((emotion_createCache as any).default ?? emotion_createCache) as typeof emotion_createCache

function useEmotionCache(options?: EmotionCacheOptions) {
  const isServerInserted = useRef(false)

  const cache = useMemo(() => {
    const cache = createCache({ key: 'css', prepend: true, ...options })
    cache.compat = true
    return cache
  }, [options])

  useServerInsertedHTML(() => {
    if (!isServerInserted.current) {
      isServerInserted.current = true
      return createElement('style', {
        key: cache.key,
        'data-emotion': `${cache.key} ${Object.keys(cache.inserted).join(' ')}`,
        dangerouslySetInnerHTML: {
          __html: Object.values(cache.inserted).join(' '),
        },
      })
    }
  })

  return cache
}
const { ToastContainer } = createStandaloneToast({ theme, defaultOptions: { position: 'top-right' } })

function CacheProvider({ children, ...cacheOptions }: CacheProviderProps) {
  return <EmotionCacheProvider value={useEmotionCache(cacheOptions)}>{children}</EmotionCacheProvider>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient(defaultOptions))

  return (
    <QueryClientProvider client={client}>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <UserContextProvider>
            <FavoritesContextProvider>
              <CartProvider>{children}</CartProvider>
            </FavoritesContextProvider>
          </UserContextProvider>
          <ToastContainer />
        </ChakraProvider>
      </CacheProvider>

      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
