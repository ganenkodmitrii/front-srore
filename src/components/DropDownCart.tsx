import Image from 'next/image'
import Link from 'next/link'

import {
  Card,
  Button,
  Stack,
  Flex,
  Text,
  Divider,
  Center,
  HStack,
  IconButton,
  Container,
  Box,
  Spinner,
} from '@chakra-ui/react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { formatPriceWithCurrency, removeProductFromCart } from '@/src/business'
import { useAuth, useCart } from '@/src/contexts'
import { useTranslation } from '@/src/i18n'
import { CloseIcon } from '@/src/icons'

interface DropDownCartProps {
  isOpen: boolean
  setIsHoveringBox: React.Dispatch<boolean>
}

const DropDownCart = ({ isOpen, setIsHoveringBox }: DropDownCartProps) => {
  const { t } = useTranslation('checkout')
  const { cart, setCart } = useCart()
  const { isAuth } = useAuth()
  const queryClient = useQueryClient()

  const cart_products = cart.cart_products?.length
    ? cart.cart_products
    : cart.products?.map((p) => ({ product: p.product.id, quantity: p.quantity }))

  const { data } = useQuery({
    ...queries.cart.calculate({
      cart_products: cart_products,
      voucher_codes: cart.voucher_codes,
      delivery_method: cart.delivery_method,
      user_email: cart.contact_info?.email,
    }),
    keepPreviousData: true,
    enabled: !!cart_products?.length,
  })

  const removeMutation = useMutation(
    async (id: number) => (isAuth ? api.cart.products.remove(id) : setCart((prev) => removeProductFromCart(prev, id))),
    { onSuccess: () => queryClient.invalidateQueries(queries.cart.get().queryKey) },
  )

  const total = formatPriceWithCurrency(data?.price ?? 0, cart.currency_code)

  if (!isOpen) return null
  if (!cart.products?.length) setIsHoveringBox(false)

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '88px',
        right: '0',
        width: '100vw',
        height: 'calc(100vh - 88px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box pos="absolute" top="0" right="0" w="100%" h="100%" bg="rgba(37, 44, 50, 0.44)" zIndex="1" />

      <Container>
        <Card
          pos="relative"
          maxW="320px"
          zIndex="9"
          ml="auto"
          p="16px 24px"
          borderRadius="0"
          bg="light-grey.200"
          fontSize="14px"
          onMouseEnter={() => setIsHoveringBox(true)}
          onMouseLeave={() => setTimeout(() => setIsHoveringBox(false), 500)}
        >
          <Stack spacing="16px">
            <Stack
              maxH="350px"
              spacing="16px"
              className="scroll-y"
              divider={<Divider borderColor="light-grey.500" />}
              borderBottom="1px solid"
              borderColor="light-grey.500"
              pb="16px"
            >
              {cart.products?.map((p) => {
                const price = formatPriceWithCurrency(+p.product.discounted_price || +p.price, cart.currency_code)
                return (
                  <HStack key={p.product.id} spacing="12px">
                    <Card variant="thumbnail" h="48px" flexShrink="0">
                      <Center h="100%" pos="relative">
                        <Image
                          src={p?.product?.attachments[0]}
                          alt={p?.product?.name}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </Center>
                    </Card>

                    <Stack color="dark-grey.400">
                      <Text>{p.product.name}</Text>
                      <Text fontWeight="600" color="mid-grey.400">
                        {price} x {p.quantity}
                      </Text>
                    </Stack>

                    <Box m="0 6px 0 auto">
                      {removeMutation.isLoading && removeMutation.variables === p.id ? (
                        <Spinner size="sm" thickness="2px" color="red.500" />
                      ) : (
                        <IconButton
                          aria-label=""
                          p="0"
                          h="20px"
                          minW="20px"
                          borderRadius="50%"
                          bg="mid-grey.200"
                          transition={'background 0.2s ease-in-out'}
                          _hover={{ bg: 'red.500' }}
                          onClick={() => removeMutation.mutate(p.id)}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </Box>
                  </HStack>
                )
              })}
            </Stack>

            <Flex justify="space-between" alignItems="center">
              <Text>{t('quantity')}: </Text>
              <Text color="mid-grey.400">
                {cart.products?.map((p) => p.quantity).reduce((a, b) => a + b, 0)} {t('products')}
              </Text>
            </Flex>

            <Flex justify="space-between" alignItems="center">
              <Text>{t('total')}: </Text>
              <Text fontWeight="600" color="mid-grey.400">
                {total}
              </Text>
            </Flex>

            <Button as={Link} href="/checkout/products" onClick={() => setIsHoveringBox(false)} size="sm">
              {t('see_cart_details')}
            </Button>
          </Stack>
        </Card>
      </Container>
    </motion.div>
  )
}

export default DropDownCart
