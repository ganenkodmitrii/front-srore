'use client'

import { useState } from 'react'

import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation'

import { Container, SimpleGrid, Grid, useToast, Flex, Button, GridItem, Center, Spinner } from '@chakra-ui/react'

import { useUpdateEffect } from '@react-hookz/web'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import queryString from 'query-string'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { SLIDER_API_NAME, HOME_PAGE_BANNERS_SLUG } from '@/src/app-constants'
import { Currency, defaultPagination } from '@/src/business'
import { Carousel, BadgeTabList, ProductCard, ResultCard, FavoriteToggleButton } from '@/src/components'
import { useAddToCart, useFavorites } from '@/src/hooks'
import { useTranslation } from '@/src/i18n'
import models from '@/src/models'

export const ClientHomePage = () => {
  const { t } = useTranslation()
  const { lang } = useParams()
  const addToCartMutation = useAddToCart(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const toast = useToast()
  const [mark, setMarks] = useState(searchParams.get('marks') || models.MarksTypes.SALE)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)

  const { data: banners, isError: isErrorBanners } = useQuery({
    ...queries.contentDelivery.getContentBySlug(SLIDER_API_NAME, `${HOME_PAGE_BANNERS_SLUG}-${lang}`, 2),
    select: (data) => data?.items,
  })

  const queryKey = queries.products.getPaginated({ ...defaultPagination, marks: mark }).queryKey
  const { data, fetchNextPage, fetchPreviousPage, isLoading, isFetching, isError } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = 1 }) =>
      api.products.getPaginated({
        ...defaultPagination,
        ...(mark && { marks: mark }),
        page: pageParam,
      }),
    onError: () =>
      toast({
        status: 'error',
        description: t('something_got_wrong'),
        isClosable: false,
      }),
    onSettled: (data) => {
      setCurrentPage(data?.pages[data.pages.length - 1].current_page || 0)
      setTotalPages(data?.pages[0].total_pages || 0)
    },
    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.total_pages ? lastPage.current_page + 1 : undefined,
  })

  useUpdateEffect(() => {
    const newURL = queryString.stringifyUrl(
      {
        url: pathname,
        query: { marks: mark },
      },
      { skipEmptyString: true, skipNull: true },
    )
    router.replace(newURL, { scroll: false })
  }, [mark, pathname, router])

  const onSelect = (mark: string) => {
    setMarks(mark)
  }

  const { onFavoriteIconClick, isFavorite } = useFavorites(queryKey, true)

  return (
    <Container padding="56px 20px">
      {!isErrorBanners && <Carousel banners={banners as models.ItemsBanner[]} />}

      <Grid gap="40px">
        <GridItem>
          <BadgeTabList selected={mark} onSelect={onSelect} tabs={Object.values(models.MarksTypes)} />
        </GridItem>
        {isError ? (
          <ResultCard type="error" onReset={() => fetchPreviousPage()} />
        ) : (
          <>
            <GridItem>
              <SimpleGrid minChildWidth="300px" spacing="40px">
                {!data?.pages?.flatMap((page) => page?.results)?.length ? (
                  <ResultCard type="no-results" isLoading={isLoading} onReset={() => router.push('/products')} />
                ) : (
                  data?.pages
                    ?.flatMap((page) => page?.results)
                    ?.map((product, idx) => {
                      const discountedPrice = +(product?.discounted_price || 0)

                      return (
                        <ProductCard
                          key={idx}
                          slug={product.slug}
                          image={product?.attachments?.[0] ?? ''}
                          name={product?.name}
                          description={product?.description}
                          price={+(product?.price || 0)}
                          discountedPrice={discountedPrice ? discountedPrice : null}
                          discountPercent={+(product?.discount_percent || 0)}
                          currency={Currency[product.currency?.code]}
                          iconButton={
                            <FavoriteToggleButton
                              favorite={isFavorite(product)}
                              onToggle={() => onFavoriteIconClick(product)}
                            />
                          }
                          h="360px"
                          bg="white"
                          footer={
                            <Flex gap="16px">
                              <Button
                                size="sm"
                                variant="outline"
                                flex={1}
                                onClick={() => router.push(`/products/${product.slug}`)}
                              >
                                {t('details')}
                              </Button>
                              <Button
                                size="sm"
                                flex={1}
                                variant="solid"
                                isLoading={
                                  addToCartMutation.isLoading && addToCartMutation.variables?.id === product.id
                                }
                                onClick={() => addToCartMutation.mutate({ id: product.id, quantity: 1 })}
                              >
                                {t('buy')}
                              </Button>
                            </Flex>
                          }
                        />
                      )
                    })
                )}
              </SimpleGrid>
            </GridItem>
            {currentPage != totalPages && (
              <GridItem>
                <Center>
                  {!isFetching ? (
                    <Button w="420px" variant="white" onClick={() => fetchNextPage()}>
                      {t('see_more')}
                    </Button>
                  ) : (
                    <Spinner size="md" />
                  )}
                </Center>
              </GridItem>
            )}
          </>
        )}
      </Grid>
    </Container>
  )
}
