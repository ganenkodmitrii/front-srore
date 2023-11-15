import { useParams, useRouter } from 'next/navigation'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  Text,
  ModalCloseButton,
  Spinner,
  Center,
  Divider,
} from '@chakra-ui/react'

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { useAuth, useCart } from '@/src/contexts'

import models from '../models'

interface PayPalModalProps {
  isOpen: boolean
  onClose: () => void
}

const PayPalModal = ({ isOpen, onClose }: PayPalModalProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { lang } = useParams()
  const { cart, setCart } = useCart()
  const { isAuth } = useAuth()
  const newCart = { ...cart }

  delete newCart.products
  if (isAuth) delete newCart.cart_products

  const { data: paypal_client_key } = useQuery({
    ...queries.settings.getAll(),
    select: (data) => data.results.find((item) => item.codename === models.Codenames.PAYPAL_CLIENT_KEY)?.value,
  })

  const paypalCreate = useMutation(() => api.paypal.create(newCart), {
    onSuccess: () => {
      queryClient.invalidateQueries(queries.cart.get().queryKey)
      setCart({ ...cart, products: [], cart_products: [] })
    },
    onError: () => router.push(`/${lang}/checkout/final?status=error`),
  })
  const mutationOptions = {
    onSuccess: (data: any) =>
      router.push(
        `/${lang}/checkout/final?status=success&id=${
          isAuth ? data?.purchase_units[0].payments.captures[0].custom_id : data.uid
        }`,
      ),
    onError: () => router.push(`/${lang}/checkout/final?status=error`),
  }

  const paypalCapture = useMutation(
    ({ customId, paypalOrderId }: { customId: string; paypalOrderId: string }) =>
      api.paypal.capture(customId, paypalOrderId),
    mutationOptions,
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent minW={{ base: 0, md: '512px' }} overflow="hidden">
        <ModalCloseButton />
        <ModalHeader>
          <Text fontSize="lg" fontWeight="bold">
            PayPal
          </Text>
        </ModalHeader>

        <Divider mb="20px" />

        <ModalBody>
          <PayPalScriptProvider
            options={{
              clientId: paypal_client_key || '',
              currency: cart.currency_code,
              intent: 'capture',
            }}
          >
            {paypalCapture.isLoading ? (
              <Center m="10px auto 30px">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="primary.500" size="xl" />
              </Center>
            ) : (
              <PayPalButtons
                createOrder={async () => {
                  const { data } = await paypalCreate.mutateAsync()
                  return data.id
                }}
                onApprove={async (data) => {
                  const response = await api.paypal.get(data.orderID)
                  const customId = response.purchase_units[0].custom_id
                  paypalCapture.mutate({ customId: customId, paypalOrderId: data.orderID })
                }}
              />
            )}
          </PayPalScriptProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PayPalModal
