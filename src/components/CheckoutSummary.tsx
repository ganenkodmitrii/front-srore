import { useEffect } from 'react'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Card, Stack, Button, Divider, Flex, Text, useToast } from '@chakra-ui/react'

import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import queries from '@/src/api/queries'
import { Currency, formatPriceWithCurrency } from '@/src/business'
import { useAuth, useCart } from '@/src/contexts'
import { useTranslation } from '@/src/i18n'
import { PencilIcon } from '@/src/icons'

import { VoucherField } from '.'

interface ProductLineProps {
  name: string
  quantity: number
  price: number
  currency: keyof typeof Currency
}

const ProductLine = ({ name, quantity, price, currency }: ProductLineProps) => {
  const { t } = useTranslation('checkout')

  return (
    <Flex direction="column" fontSize="14px">
      <Text variant="ellipsis" maxW="300px" title={name}>
        {name}
      </Text>

      <Flex justify="space-between" alignItems="center">
        <Text color="mid-grey.400">
          {t('quantity')}: {quantity}
        </Text>

        <Text color="mid-grey.400">{formatPriceWithCurrency(quantity * price, currency)}</Text>
      </Flex>
    </Flex>
  )
}

interface LineProps {
  total?: boolean
  name: string
  value: string
}

const Line = ({ total, name, value }: LineProps) => {
  const totalProps = {
    color: total ? 'primary.500' : 'mid-grey.400',
    fontWeight: total ? '600' : '400',
    fontSize: total ? '18px' : '14px',
  }

  return (
    <Flex justify="space-between" alignItems="center">
      <Text fontSize="14px">{name}</Text>

      <Text {...totalProps}>{value}</Text>
    </Flex>
  )
}

interface CheckoutSummaryProps {
  hideHeader?: boolean
  openAuthModal?: () => void
}

const CheckoutSummary = ({ hideHeader, openAuthModal }: CheckoutSummaryProps) => {
  const { t } = useTranslation('checkout')
  const { user, isAuth } = useAuth()
  const { cart, setCart } = useCart()
  const toast = useToast()
  const path = usePathname()
  const router = useRouter()
  const cart_products = cart.cart_products?.length
    ? cart.cart_products
    : cart.products?.map((p) => ({ product: p.product.id, quantity: p.quantity }))

  const { data, refetch } = useQuery({
    ...queries.cart.calculate({
      cart_products: cart_products,
      voucher_codes: cart.voucher_codes,
      delivery_method: cart.delivery_method,
      user_email: cart.contact_info?.email,
    }),
    retry: 0,
    enabled: !!cart_products?.length,
    keepPreviousData: true,
    onError: (e: AxiosError) => {
      const hasVoucherError = Object.prototype.hasOwnProperty.call(e.response?.data, 'voucher_codes')

      if (hasVoucherError) {
        setCart({ ...cart, voucher_codes: cart.voucher_codes?.slice(0, -1) })
        toast({
          title: 'Error',
          description: t('invalid_voucher_code'),
          status: 'error',
          isClosable: true,
        })
      }
    },
  })

  useEffect(() => {
    // don't refetch if there are no products in the cart and no price
    if (!cart.cart_products?.length && !data?.price) return
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.cart_products, cart.voucher_codes, cart.delivery_method, cart.contact_info?.email])

  const subtotal = formatPriceWithCurrency(data?.regular_price ?? 0, cart.currency_code)
  const discount = formatPriceWithCurrency(Math.abs(data?.discounted_amount ?? 0), cart.currency_code)
  const total_tax = formatPriceWithCurrency(data?.tax_amount ?? 0, cart.currency_code)
  const total = formatPriceWithCurrency(data?.price ?? 0, cart.currency_code)
  const delivery = formatPriceWithCurrency(data?.delivery_price ?? 0, cart.currency_code)

  const isProductsVisible = !path.includes('products')

  return (
    <Card p="16px">
      {!hideHeader && (
        <Flex justify="space-between" alignItems="center">
          <Text as="h3">{t('cart')}</Text>

          {isProductsVisible && (
            <Link href="/checkout/products">
              <PencilIcon fontSize="24px" />
            </Link>
          )}
        </Flex>
      )}

      {isProductsVisible && (
        <Stack spacing="8px" mt="16px">
          {cart.products?.map((p) => {
            const attributes = p.product.attributes.map((a) => `${a.attribute.name}: ${a.value}`)
            const name = `${p.product.name} ${attributes.length ? `(${attributes})` : ''}`
            const price = +p.product.discounted_price || +p.product.price

            return (
              <ProductLine key={p.id} name={name} quantity={p.quantity} price={price} currency={cart.currency_code} />
            )
          })}
          <Divider />
        </Stack>
      )}

      <Stack spacing="8px" mt="16px">
        {(isAuth || cart.contact_info?.email) && <VoucherField />}
        <Line name={t('subtotal')} value={subtotal} />
        {discount && <Line name={t('discount')} value={`- ${discount}`} />}
        <Line name={t('delivery')} value={delivery} />
        <Line name={t('vat')} value={total_tax} />

        <Divider />

        <Line total name={t('total')} value={total} />
        {!isProductsVisible && (
          <Button
            isDisabled={!cart.products?.length}
            onClick={() => {
              user ? router.push('/checkout/delivery') : openAuthModal?.()
            }}
            w="100%"
            size="sm"
          >
            {t('continue')}
          </Button>
        )}
      </Stack>
    </Card>
  )
}

export default CheckoutSummary
