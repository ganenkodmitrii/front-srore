import { cookies } from 'next/headers'

import { Hydrate, dehydrate } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { COOKIE_LANGUAGE, DISCOUNT_LIST_API_NAME, DISCOUNT_PAGE_BANNERS_SLUG } from '@/src/app-constants'
import { defaultPagination } from '@/src/business'
import models from '@/src/models'
import { getQueryClient } from '@/src/utils'

import { ClientAboutPage } from './discounts-page'

export default async function ServerDiscountsPage() {
  const lang = cookies().get(COOKIE_LANGUAGE)?.value
  const queryClient = getQueryClient()

  // const filtersValue = {
  //   page: defaultPagination.page,
  //   per_page: defaultPagination.per_page,
  //   marks: models.MarksTypes.SALE,
  // }

  // await queryClient.prefetchQuery(queries.products.getPaginated(filtersValue))
  await queryClient.prefetchQuery(
    queries.contentDelivery.getContentBySlug(DISCOUNT_LIST_API_NAME, `${DISCOUNT_PAGE_BANNERS_SLUG}-${lang}`, 1),
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <ClientAboutPage />
    </Hydrate>
  )
}
