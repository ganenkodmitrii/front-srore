'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  chakra,
  Card,
  CardBody,
  Container,
  Flex,
  Box,
  Button,
  SimpleGrid,
  Center,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@chakra-ui/react'

import { useThrottledState, useUpdateEffect } from '@react-hookz/web'
import { useQuery } from '@tanstack/react-query'
import queryString from 'query-string'

import queries from '@/src/api/queries'
import { Currency, ProductsFiltersState } from '@/src/business'
import {
  FavoriteToggleButton,
  Pagination,
  ProductCard,
  ProductsFilters,
  ProductsSearchAndOrdering,
  ResultCard,
} from '@/src/components'
import { useAddToCart, useFavorites } from '@/src/hooks'
import { ChevronLeftIcon, ChevronRightIcon, FilterIcon } from '@/src/icons'

const baseStyle = { color: 'mid-grey.100' }
const ChakraChevronLeftIcon = chakra(ChevronLeftIcon, baseStyle)
const ChakraChevronRightIcon = chakra(ChevronRightIcon, baseStyle)
const ChakraFilterIcon = chakra(FilterIcon)

const Products = () => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const initialFiltersValue: ProductsFiltersState = useMemo(
    () => ({
      search: searchParams.get('search') || undefined,
      ordering: searchParams.get('ordering') || undefined,
      price_gte: Number(searchParams.get('price_gte')) || undefined,
      price_lte: Number(searchParams.get('price_lte')) || undefined,
      categories: searchParams.getAll('categories').map(Number).filter(Boolean),
      brand: searchParams.getAll('brand').map(Number).filter(Boolean),
      page: Number(searchParams.get('page')) || 1,
      per_page: 12,
    }),
    [searchParams],
  )
  // this make force re-render of filters on reset
  const [lastFilterUpdateDate, setLastFilterUpdateDate] = useState(Date.now())

  const [filtersValue, setFiltersValue] = useThrottledState(initialFiltersValue, 400)

  useEffect(() => {
    setFiltersValue(initialFiltersValue)
    setTimeout(() => setLastFilterUpdateDate(Date.now()), 400)
  }, [initialFiltersValue, setFiltersValue])

  const { queryKey, queryFn } = queries.products.getPaginated(filtersValue)
  const { data, isLoading, isError } = useQuery(queryKey, queryFn, { keepPreviousData: true })

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

  const { onFavoriteIconClick, isFavorite } = useFavorites(queryKey)
  const addToCartMutation = useAddToCart(false)

  // Page is 0 indexed
  const handlePageChange = (value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setFiltersValue((prev) => ({ ...prev, page: value + 1 }))
  }

  const filtersDrawer = useDisclosure()

  const productsFilters = (
    <ProductsFilters
      // this key make force re-render of filters on reset
      key={lastFilterUpdateDate}
      initialFiltersValue={initialFiltersValue}
      onFiltersChange={setFiltersValue}
    />
  )
  const productsSearchAndOrdering = (
    <ProductsSearchAndOrdering
      // this key make force re-render of filters on reset
      key={lastFilterUpdateDate}
      initialFiltersValue={initialFiltersValue}
      onFiltersChange={setFiltersValue}
    />
  )

  const onReset = () => {
    setFiltersValue({ per_page: 12 })
    setTimeout(() => setLastFilterUpdateDate(Date.now()), 400)
  }

  return (
    <Container m="32px auto 64px">
      <chakra.h1 mb="24px">Feed</chakra.h1>
      <Flex gap="40px" align="start">
        <Card
          display={{
            base: 'none',
            lg: 'initial',
          }}
          w={320}
        >
          <CardBody>{productsFilters}</CardBody>
        </Card>

        <Box flex={1}>
          <Card display={{ base: 'none', md: 'block' }} mb="24px">
            <CardBody py="12px">{productsSearchAndOrdering}</CardBody>
          </Card>
          <Box display={{ base: 'block', md: 'none' }}>{productsSearchAndOrdering}</Box>
          <Flex display={{ base: 'flex', lg: 'none' }} justify="end" mt="32px" mb="40px">
            <Button onClick={filtersDrawer.onOpen} rightIcon={<ChakraFilterIcon fontSize="24px" />}>
              {t('filters')}
            </Button>
          </Flex>

          <SimpleGrid gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" spacing="40px">
            {data?.results?.map((product, idx) => {
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
                  discountPercent={+(product.discount_percent || 0)}
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
                        isLoading={addToCartMutation.isLoading && addToCartMutation.variables?.id === product.id}
                        onClick={() => addToCartMutation.mutate({ id: product.id, quantity: 1 })}
                      >
                        {t('buy')}
                      </Button>
                    </Flex>
                  }
                />
              )
            })}
          </SimpleGrid>

          {(data?.total_pages ?? 0) > 1 && (
            <Center mt="40px">
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
            </Center>
          )}
          {!data?.results?.length && !isError && (
            <ResultCard type="no-results" isLoading={isLoading} onReset={onReset} />
          )}
          {isError && <ResultCard type="error" onReset={onReset} />}
        </Box>
      </Flex>
      <Drawer placement="left" size="sm" isOpen={filtersDrawer.isOpen} onClose={filtersDrawer.onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t('filters')}</DrawerHeader>

          <DrawerBody>{productsFilters}</DrawerBody>

          <DrawerFooter>
            <Button variant="solid" onClick={filtersDrawer.onClose} colorScheme="teal">
              {t('close')}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  )
}

export default Products
