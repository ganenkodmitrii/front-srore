'use client'

import { useMemo, useState } from 'react'

import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation'

import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Container,
  Grid,
  GridItem,
  SimpleGrid,
  Heading,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useToast,
  useUpdateEffect,
  chakra,
  Flex,
  Button,
  Center,
} from '@chakra-ui/react'

import { useQuery } from '@tanstack/react-query'
import queryString from 'query-string'

import queries from '@/src/api/queries'
import { DISCOUNT_LIST_API_NAME, DISCOUNT_PAGE_BANNERS_SLUG } from '@/src/app-constants'
import { Currency, defaultPagination } from '@/src/business'
import { FavoriteToggleButton, Pagination, ProductCard, ResultCard } from '@/src/components'
import { useAddToCart, useFavorites } from '@/src/hooks'
import { useTranslation } from '@/src/i18n'
import { ChevronLeftIcon, ChevronRightIcon } from '@/src/icons'
import models from '@/src/models'

const ChakraChevronLeftIcon = chakra(ChevronLeftIcon, {
  baseStyle: { color: 'mid-grey.100' },
})
const ChakraChevronRightIcon = chakra(ChevronRightIcon, {
  baseStyle: { color: 'mid-grey.100' },
})

export const ClientAboutPage = () => {
  const { lang } = useParams()
  const { t } = useTranslation()
  const toast = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const addToCartMutation = useAddToCart(false)

  const initialFiltersValue = useMemo(
    () => ({
      page: Number(searchParams.get('page')) || defaultPagination.page,
      per_page: defaultPagination.per_page,
      marks: models.MarksTypes.SALE,
    }),
    [searchParams],
  )

  const [filtersValue, setFiltersValue] = useState(initialFiltersValue)

  const { data: discountBanners, isError: isErrorDiscountBanners } = useQuery({
    ...queries.contentDelivery.getContentBySlug(DISCOUNT_LIST_API_NAME, `${DISCOUNT_PAGE_BANNERS_SLUG}-${lang}`, 1),
  })

  const { data, isError, refetch } = useQuery({
    ...queries.products.getPaginated(filtersValue),
    onError: () =>
      toast({
        status: 'error',
        description: t('something_got_wrong'),
        isClosable: false,
      }),
  })

  const { onFavoriteIconClick, isFavorite } = useFavorites(queries.products.getPaginated(filtersValue).queryKey)

  useUpdateEffect(() => {
    const newURL = queryString.stringifyUrl(
      {
        url: pathname,
        query: { ...filtersValue },
      },
      { skipEmptyString: true, skipNull: true },
    )
    router.replace(newURL, { scroll: false })
  }, [filtersValue, pathname, router])

  const handlePageChange = (value: number) => {
    const element = document.getElementById('discount_title')
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    setFiltersValue((prev) => ({ ...prev, page: value + 1 }))
  }

  return (
    <Container padding="32px 20px 64px">
      {!isErrorDiscountBanners && !!discountBanners?.items.length && (
        <>
          <VStack align="start">
            {discountBanners?.title && (
              <Heading fontSize="36px" fontWeight="bold">
                {discountBanners?.title}
              </Heading>
            )}
            <Text mt="16px" maxWidth="460" color="mid-grey.400" fontSize="24px" lineHeight="32px" fontWeight="semibold">
              {discountBanners.description}
            </Text>
          </VStack>

          <Wrap mt="64px" mb="100px" spacing="40px" maxW="100%" justify="center">
            {discountBanners?.items?.map((banner: models.ItemsBanner, index: number) => (
              <WrapItem key={index}>
                <Card
                  key={index}
                  h="400px"
                  minW="320px"
                  gridAutoColumns="auto"
                  bgRepeat="no-repeat"
                  sx={{
                    backgroundImage: `url(${banner?.image?.url})`,
                    backgroundSize: 'cover',
                  }}
                  w={{
                    base: '100%',
                    md: banner?.size?.includes(models.SizeTypes.SMALL) ? '100%' : '680px',
                  }}
                >
                  <CardHeader p="16px">
                    <Badge
                      colorScheme="none"
                      fontSize="14px"
                      fontWeight="semibold"
                      bgColor="light-grey.200"
                      color="dark-grey.400"
                      p="6px 12px"
                      variant="outline"
                    >
                      {`${banner.promotion_period_start} - ${banner?.promotion_period_end}`}
                    </Badge>
                  </CardHeader>

                  <CardBody mb="24px">
                    <VStack
                      align={banner?.size?.includes(models.SizeTypes.SMALL) ? 'center' : 'start'}
                      justify={banner?.size?.includes(models.SizeTypes.SMALL) ? 'start' : 'end'}
                      h="100%"
                    >
                      <Text
                        fontWeight="bold"
                        fontSize="20px"
                        color="white"
                        maxW={banner?.size?.includes(models.SizeTypes.SMALL) ? '250px' : '416px'}
                        align={banner?.size?.includes(models.SizeTypes.SMALL) ? 'center' : 'start'}
                      >
                        {banner.title}
                      </Text>

                      {!banner?.size?.includes(models.SizeTypes.SMALL) && banner?.description && (
                        <Text color="white" opacity="0.6">
                          {banner?.description}
                        </Text>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </WrapItem>
            ))}
          </Wrap>
        </>
      )}

      <Heading fontSize="36px" mb="64px" fontWeight="bold" id="discount_title">
        {t('discount.hottest_offers')}
      </Heading>
      <Grid gap="40px">
        {isError ? (
          <ResultCard type="error" onReset={() => refetch()} />
        ) : (
          <>
            <GridItem>
              <SimpleGrid minChildWidth="300px" spacing="40px">
                {!data?.results?.length ? (
                  <ResultCard type="no-results" onReset={() => router.push('/products')} />
                ) : (
                  data?.results?.map((product, idx) => {
                    const discountedPrice = +(product?.discounted_price || 0)

                    return (
                      <ProductCard
                        key={idx}
                        image={product?.attachments?.[0] ?? ''}
                        name={product?.name}
                        slug={product.slug}
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
            <GridItem>
              <Center>
                {(data?.total_pages ?? 0) > 1 && (
                  <Pagination
                    onPageChange={({ selected }) => handlePageChange(selected)}
                    breakLabel="..."
                    nextLabel={<ChakraChevronRightIcon fontSize="32px" />}
                    previousLabel={<ChakraChevronLeftIcon fontSize="32px" />}
                    initialPage={+(filtersValue?.page ?? 1) - 1}
                    pageRangeDisplayed={data?.per_page}
                    pageCount={data?.total_pages ?? 0}
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={1}
                  />
                )}
              </Center>
            </GridItem>
          </>
        )}
      </Grid>
    </Container>
  )
}
