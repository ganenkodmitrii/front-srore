import { useRouter } from 'next/navigation'

import { useToast } from '@chakra-ui/react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { addProductToCart } from '@/src/business'
import { useAuth, useCart } from '@/src/contexts'
import { useTranslation } from '@/src/i18n'

export function useAddToCart(redirectToCheckout = true) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const toast = useToast()
  const { isAuth } = useAuth()
  const { setCart } = useCart()
  const { t } = useTranslation('products')

  const addToCartMutation = useMutation(
    async ({ id, quantity }: { id: number; quantity: number }) => {
      if (isAuth) {
        await api.cart.products.add({ product: id, quantity: quantity })
      } else {
        setCart((prev) => addProductToCart(prev, id, quantity))
      }
    },
    {
      onSuccess: () => {
        redirectToCheckout && router.push('/checkout/products')
        queryClient.invalidateQueries(isAuth ? queries.cart.get().queryKey : queries.products.getPaginated().queryKey)
        toast.closeAll()
        toast({
          status: 'success',
          description: t('added_to_cart'),
          isClosable: true,
        })
      },
    },
  )

  return addToCartMutation
}
