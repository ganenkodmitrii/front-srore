import { cookies } from 'next/headers'

import { Hydrate, dehydrate } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { COOKIE_LANGUAGE, FAQ_API_NAME, FAQ_SLUG } from '@/src/app-constants'
import { getQueryClient } from '@/src/utils'

import { ClientFAQPage } from './faq-page'

export default async function ServerFAQPage() {
  const lang = cookies().get(COOKIE_LANGUAGE)?.value

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(queries.contentDelivery.getContentBySlug(FAQ_API_NAME, `${FAQ_SLUG}-${lang}`, 1))

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <ClientFAQPage />
    </Hydrate>
  )
}
