'use client'

import { useContext, useMemo, useState } from 'react'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'

import {
  Button,
  Center,
  chakra,
  Container,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  useToast,
  useUpdateEffect,
} from '@chakra-ui/react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import queryString from 'query-string'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { addBulkToCart, Currency, ProductsFiltersState } from '@/src/business'
import { Pagination, ProductCard, ResultCard } from '@/src/components'
import { FavoritesContext, useCart, UserContext } from '@/src/contexts'
import { useAddToCart } from '@/src/hooks'
import { useTranslation } from '@/src/i18n'
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@/src/icons'
import models from '@/src/models'

const ChakraDeleteIcon = chakra(DeleteIcon, {
  baseStyle: { color: 'red.600', fill: 'red.100', fontSize: '24px' },
})
const ChakraChevronLeftIcon = chakra(ChevronLeftIcon, {
  baseStyle: { color: 'mid-grey.100' },
})
const ChakraChevronRightIcon = chakra(ChevronRightIcon, {
  baseStyle: { color: 'mid-grey.100' },
})

const FavoritesPage = () => {
  const { t: tFavorites } = useTranslation('favorites_page')
  const { t } = useTranslation()
  const { setCart } = useCart()
  const { isAuth } = useContext(UserContext)
  const { favorites, setFavorites } = useContext(FavoritesContext)
  const moveToCartMutation = useAddToCart(false)
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const router = useRouter()
  const toast = useToast()
  const cartQueryKey = isAuth ? queries.cart.get().queryKey : queries.products.getPaginated().queryKey

  const initialFiltersValue: ProductsFiltersState = useMemo(
    () => ({
      page: Number(searchParams.get('page')) || 1,
      per_page: 12,
      is_favorites: true,
    }),
    [searchParams],
  )
  const [filtersValue, setFiltersValue] = useState(initialFiltersValue)

  const { queryKey: queryKeyProducts } = queries.products.getPaginated(filtersValue)
  const { queryKey: queryKeyFavorites } = queries.products.getFavorites()
  const { queryKey: queryKeyLocalFavorites } = queries.products.getPaginated({
    ...filtersValue,
    ids: favorites.join(),
    is_favorites: undefined,
  })

  const { data: noAuthFavorites, isFetching: isFetchingNonAuth } = useQuery({
    ...queries.products.getPaginated({
      ...filtersValue,
      ids: favorites.join(),
      is_favorites: undefined,
    }),
    enabled: !isAuth && !!favorites.length,
  })
  const { data, isFetching: isFetchingAuth } = useQuery({
    ...queries.products.getPaginated(filtersValue),
    enabled: !!isAuth,
  })
  const { data: allFavorites } = useQuery({
    ...queries.products.getFavorites(),
    enabled: !!isAuth,
  })
  const allFavoritesIds = allFavorites?.map((item) => item.favorite.id)

  const onError = () =>
    toast({
      isClosable: true,
      status: 'error',
      description: t('something_got_wrong'),
    })

  const setCacheData = async (id: number, isAuth: boolean) => {
    const queryKey = isAuth ? queryKeyProducts : queryKeyLocalFavorites

    await queryClient.cancelQueries(queryKey)
    const prevProducts: models.WithResults<models.Product> | undefined = queryClient.getQueryData(queryKey)
    const results = prevProducts?.results.filter((product) => product.id !== id)

    queryClient.setQueryData(queryKey, () => {
      return {
        ...prevProducts,
        count: results?.length,
        results: isAuth
          ? prevProducts?.results.filter((product) => product.favorite.id !== id)
          : prevProducts?.results.filter((product) => product.id !== id),
      }
    })
    return { prevProducts }
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.products.deleteFavoriteById(id),
    onMutate: (id: number) => setCacheData(id, !!isAuth),
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKeyProducts, context?.prevProducts)
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKeyProducts)
      queryClient.invalidateQueries(queryKeyFavorites)
    },
  })

  const deleteBulkMutation = useMutation((ids: number[] | undefined) => api.products.deleteFavoriteBulk(ids), {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeyProducts)
      queryClient.invalidateQueries(queryKeyFavorites)
    },
    onError: onError,
  })

  const moveAllMutation = useMutation(
    async (favoriteProducts: models.CartProduct[]) =>
      isAuth
        ? api.cart.products.addBulk(favoriteProducts)
        : setCart((prev) =>
            addBulkToCart(
              prev,
              noAuthFavorites?.results.map((item) => ({
                quantity: 1,
                product: item.id,
              })),
            ),
          ),
    { onSuccess: () => queryClient.invalidateQueries(cartQueryKey), onError: onError },
  )

  const onDelete = (id: number) => {
    isAuth ? deleteMutation.mutate(id) : setFavorites(favorites.filter((item) => item !== id.toString()))
    !isAuth && setCacheData(id, false)
    queryClient.invalidateQueries(queryKeyLocalFavorites)
  }

  const onDeleteAll = () => {
    isAuth ? deleteBulkMutation.mutate(allFavoritesIds) : setFavorites([])
  }

  const onMoveToCart = (id: number, favoriteId?: number) => {
    moveToCartMutation.mutate(
      { id, quantity: 1 },
      {
        onSuccess: () => {
          onDelete(favoriteId || id), queryClient.invalidateQueries(cartQueryKey)
        },
      },
    )
  }

  const onMoveAllToCart = () => {
    const products = (isAuth ? allFavorites : noAuthFavorites?.results)?.map((item) => {
      return { quantity: 1, product: item.id }
    })
    if (!products?.length) return
    moveAllMutation.mutate(products, { onSuccess: onDeleteAll })
  }

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setFiltersValue((prev) => ({ ...prev, page: value + 1 }))
  }

  const products = isAuth ? data : noAuthFavorites
  const isFetching = isAuth ? isFetchingAuth : isFetchingNonAuth
  const buttonIsDisabled = !products?.results.length && !favorites.length

  return (
    <Container my="64px">
      <chakra.h1 mb="24px">Favorite</chakra.h1>
      <HStack
        justify="space-between"
        align={{ base: 'unset', sm: 'center' }}
        flexWrap="wrap"
        bg="white"
        borderRadius="8px"
        p="12px 16px"
        color="dark-grey.400"
        mb="24px"
        flexDirection={{ base: 'column', sm: 'row' }}
      >
        <Text>
          {products?.results.length} {tFavorites('products')}
        </Text>
        <HStack flexWrap="wrap" w={{ base: '100%', sm: 'unset' }}>
          <Button
            variant="outline"
            size="sm"
            w={{ base: '100%', sm: 'unset' }}
            isDisabled={buttonIsDisabled}
            onClick={onDeleteAll}
          >
            {tFavorites('remove_all_items')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            w={{ base: '100%', sm: 'unset' }}
            isDisabled={buttonIsDisabled}
            onClick={onMoveAllToCart}
          >
            {tFavorites('move_all_to_cart')}
          </Button>
        </HStack>
      </HStack>

      {!products?.results.length && (
        <ResultCard type="no-favorites" isLoading={isFetching} onReset={() => router.push('/products')} />
      )}

      <SimpleGrid spacing="40px" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))">
        {products?.results.map((item, idx) => {
          const discountedPrice = +(item?.discounted_price || 0)
          return (
            <ProductCard
              key={idx}
              iconButton={
                <IconButton rounded="full" aria-label="" size="sm" variant="outline" bg="white">
                  <ChakraDeleteIcon onClick={() => onDelete(isAuth ? item.favorite.id : item.id)} />
                </IconButton>
              }
              image={item?.attachments?.[0] ?? ''}
              name={item.name}
              slug={item.slug}
              description={item.description}
              price={+(item?.price || 0)}
              discountedPrice={discountedPrice ? discountedPrice : null}
              discountPercent={+(item.discount_percent || 0)}
              currency={Currency[item.currency?.code]}
              onDelete={onDelete}
              footer={
                <Button w="full" size="sm" onClick={() => onMoveToCart(item.id, item.favorite?.id)}>
                  {tFavorites('move_to_cart')}
                </Button>
              }
            />
          )
        })}
      </SimpleGrid>

      <Center mt="40px">
        {(products?.total_pages ?? 0) > 1 && (
          <Pagination
            onPageChange={({ selected }) => handlePageChange(selected)}
            breakLabel="..."
            nextLabel={<ChakraChevronRightIcon fontSize="32px" />}
            previousLabel={<ChakraChevronLeftIcon fontSize="32px" />}
            initialPage={+(filtersValue?.page ?? 1) - 1}
            pageRangeDisplayed={products?.per_page}
            pageCount={products?.total_pages ?? 0}
            renderOnZeroPageCount={null}
            marginPagesDisplayed={1}
          />
        )}
      </Center>
    </Container>
  )
}

export default FavoritesPage
