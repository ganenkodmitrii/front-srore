import { Hydrate, dehydrate } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { getQueryClient } from '@/src/utils'

import { ClientProductDetailsPage } from './product-page'

interface PageProps {
  params: { lang: string; slug: string }
}

export default async function ServerAboutPage({ params: { slug, lang } }: PageProps) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(queries.products.getBySlug(slug))

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <ClientProductDetailsPage params={{ lang, slug }} />
    </Hydrate>
  )
}
