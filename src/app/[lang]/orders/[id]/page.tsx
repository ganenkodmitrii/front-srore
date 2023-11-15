'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  HStack,
  Heading,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from '@chakra-ui/react'

import { useQuery } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { Currency, formatPriceWithCurrency } from '@/src/business'
import { formateDate } from '@/src/business'
import { AddressCard } from '@/src/components'
import { useTranslation } from '@/src/i18n'

const OrderDetail = () => {
  const { t: tProfileOrders } = useTranslation('profile.orders')
  const { t } = useTranslation()

  const { id } = useParams()
  const router = useRouter()
  const orderId = Array.isArray(id) ? id[0] : id
  const toast = useToast()

  const { data, status } = useQuery({
    ...queries.orders.getById(orderId),
    enabled: !!id,
    retry: false,
    onError: () => {
      router.push('/')
      toast({
        status: 'error',
        isClosable: true,
        description: t('something_got_wrong'),
      })
    },
  })

  return (
    <>
      {status === 'success' && (
        <Container padding="0 20px" m="52px auto 64px">
          <HStack gap="40px">
            <VStack spacing="24px" align="start" w="100%">
              <Card w="100%">
                <CardBody>
                  <Stack direction={['column', 'row']} justifyContent="space-between">
                    <Heading as="h2" fontSize="16px" fontWeight="semibold">
                      #{data?.id}
                    </Heading>

                    <Text color="mid-grey.400">
                      {tProfileOrders('placement_date')} : {formateDate(data?.created_at)}
                    </Text>

                    <Badge bg="primary.500" color="white" size="md">
                      {t(`filter_tabs.${data?.status}`)}
                    </Badge>
                  </Stack>
                </CardBody>
              </Card>

              <Stack direction={['column', 'row']} spacing="50px" w="100%" align="start">
                <AddressCard w="100%" hideButtons profileAddress={{ address: data?.address }} />
              </Stack>

              {data.comment && (
                <Card w="100%" p="24px">
                  <CardHeader as="h2" fontSize="16px" p="0px">
                    {tProfileOrders('order_note')}
                  </CardHeader>

                  <CardBody p="24px 0px 0px 0px">
                    <Text>{data?.comment}</Text>
                  </CardBody>
                </Card>
              )}

              <TableContainer w="300px" minW="100%" bgColor="white" borderRadius="8px" overflowX="auto">
                <Table>
                  <Thead h="44px" fontFamily="inherit" color="mid-grey.400" bgColor="light-grey.100">
                    <Tr>
                      <Th textTransform="none" fontFamily="inherit" fontWeight={400}>
                        {tProfileOrders('product_details')}
                      </Th>
                      <Th textTransform="none" fontFamily="inherit" fontWeight={400}>
                        {tProfileOrders('quantity')}
                      </Th>
                      <Th textTransform="none" fontFamily="inherit" fontWeight={400}>
                        {tProfileOrders('discounted_price')}
                      </Th>
                      <Th textTransform="none" fontFamily="inherit" fontWeight={400}>
                        {tProfileOrders('price')}
                      </Th>
                      <Th textTransform="none" fontFamily="inherit" fontWeight={400}>
                        {tProfileOrders('total')}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.cart_products.map((product) => {
                      const normalPrice = +product.price
                      const discountedPrice = +product.product.discounted_price
                      const currency = Currency[product.product.currency?.code]

                      const totalPrice = product.quantity * (discountedPrice || normalPrice)
                      const formattedPrice = formatPriceWithCurrency(normalPrice, currency)
                      const formattedDiscountedPrice = discountedPrice
                        ? formatPriceWithCurrency(discountedPrice, currency)
                        : undefined
                      const formattedTotalPrice = formatPriceWithCurrency(totalPrice, currency)

                      return (
                        <Tr key={product.id}>
                          <Td>
                            <HStack align="start" spacing="24px">
                              <Card variant="thumbnail-light" w="80px" h="80px" flexShrink="0">
                                <Center h="100%" pos="relative">
                                  <Image
                                    fill
                                    src={product.product.attachments[0]}
                                    alt={product.product.name}
                                    style={{ objectFit: 'contain' }}
                                  />
                                </Center>
                              </Card>
                              <VStack align="start">
                                <Text>{product.product.name}</Text>

                                <Stack direction={['column', 'row']} spacing="8px" wrap="wrap">
                                  {product.product.attributes.map((attribute) => (
                                    <Badge
                                      key={attribute.id}
                                      colorScheme="none"
                                      border="1px solid"
                                      borderColor="light-grey.400"
                                      color="dark-grey.400"
                                      rounded="full"
                                      variant="outline"
                                      size="sm"
                                      maxW="150px"
                                      overflow="hidden"
                                      isTruncated
                                      cursor="default"
                                      title={`${attribute.attribute.name}: ${attribute.value}`}
                                    >
                                      {attribute.attribute.name}: {attribute.value}
                                    </Badge>
                                  ))}
                                </Stack>
                              </VStack>
                            </HStack>
                          </Td>
                          <Td verticalAlign="top">{product.quantity}</Td>
                          <Td verticalAlign="top">{formattedDiscountedPrice}</Td>
                          <Td verticalAlign="top" textDecoration={discountedPrice ? 'line-through' : 'none'}>
                            {formattedPrice}
                          </Td>
                          <Td verticalAlign="top">{formattedTotalPrice}</Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </HStack>
        </Container>
      )}
    </>
  )
}

export default OrderDetail
