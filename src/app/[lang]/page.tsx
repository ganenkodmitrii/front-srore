import { cookies } from 'next/headers'

import { Hydrate, dehydrate } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { COOKIE_LANGUAGE, HOME_PAGE_BANNERS_SLUG, SLIDER_API_NAME } from '@/src/app-constants'
import { defaultPagination } from '@/src/business'
import models from '@/src/models'
import { getQueryClient } from '@/src/utils'

import { ClientHomePage } from './home-page'

export default async function ServerHomePage() {
  const lang = cookies().get(COOKIE_LANGUAGE)?.value

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    queries.contentDelivery.getContentBySlug(SLIDER_API_NAME, `${HOME_PAGE_BANNERS_SLUG}-${lang}`, 2),
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <ClientHomePage />
    </Hydrate>
  )
}
