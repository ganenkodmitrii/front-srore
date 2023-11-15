import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Badge, Box, Button, Card, Flex, HStack, Stack, StackProps, Text } from '@chakra-ui/react'

import queries from '@/src/api/queries'
import { Currency, formatPriceWithCurrency } from '@/src/business'
import {
  CustomizedNumberInput,
  DeliveryCard,
  FavoriteToggleButton,
  FieldMeta,
  ImageGallery,
  ShareButton,
  VariantChooser,
} from '@/src/components'
import { useAddToCart, useFavorites } from '@/src/hooks'
import { useTranslation } from '@/src/i18n'
import models from '@/src/models'

interface ProductInfoProps extends StackProps {
  product?: models.Product
  onProductChange?: (slug?: string) => void
}

const ProductInfo = ({ product, onProductChange, ...props }: ProductInfoProps) => {
  const { t } = useTranslation('products')
  const { slug, lang } = useParams()
  const [productQuantity, setProductQuantity] = useState(1)
  const [productId, setProductId] = useState(product?.id)
  const addToCartMutation = useAddToCart()

  useEffect(() => setProductId(product?.id), [product?.id])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    () => onProductChange?.(product?.parent?.variants.find((v) => v.id === productId)?.slug),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productId],
  )

  const price = +(product?.price ?? 0)
  const discountedPrice = +(product?.discounted_price ?? 0)
  const currency = Currency[product?.currency?.code ?? Currency.EUR]

  const { onFavoriteIconClick, isFavorite } = useFavorites(queries.products.getBySlug(slug).queryKey, true)
  const homeDeliveryTime = product?.delivery_time?.split(' ')[0]
  const pickupTime = product?.pickup_time?.split(' ')[0]
  const productHasVariants = product?.attributes?.some((a) => a.is_different)

  return (
    <Stack {...props}>
      <Stack>
        <Flex
          justifyContent="space-between"
          alignItems="flex-start"
          flexDirection={{ base: 'column', md: 'row' }}
          gap="8px"
        >
          <Stack spacing="0">
            <h1>{product?.name}</h1>

            <HStack gap="8px 16px" flexWrap="wrap">
              <Text color="mid-grey.400">
                {t('product_id')}: {productId}
              </Text>
              <HStack spacing={{ base: '8px', md: '16px' }} flexWrap="wrap">
                {product?.marks?.map((mark, idx) => (
                  <Badge key={idx} size="md" variant="green">
                    {mark}
                  </Badge>
                ))}
                {product?.discount_percent && (
                  <Badge size="md" variant="red">
                    {(+product.discount_percent).toFixed()}%
                  </Badge>
                )}
              </HStack>
            </HStack>
          </Stack>

          <HStack spacing="16px">
            {product?.brand?.logo && (
              <Box as={Link} href={`/${lang}/products?brand=${product?.brand.id}`}>
                <Image
                  src={product?.brand.logo}
                  alt={product?.brand.name}
                  style={{ padding: '4px' }}
                  width={32}
                  height={32}
                />
              </Box>
            )}
            <FavoriteToggleButton
              variant="text"
              iconSize="33px"
              favorite={product ? isFavorite(product) : false}
              onToggle={() => (product ? onFavoriteIconClick(product) : null)}
            />
            <ShareButton title={product?.name} />
          </HStack>
        </Flex>
      </Stack>

      <Flex
        display={{ base: 'grid', md: 'flex' }}
        gridTemplateColumns="1fr"
        justifyContent={{ base: 'space-between', md: 'flex-start' }}
        flexDirection={{ base: 'column', md: 'row' }}
        wrap={{ base: 'wrap', xl: 'nowrap' }}
        mt="24px"
        gap="40px"
        flexWrap="wrap"
      >
        <ImageGallery productName={product?.name} images={product?.attachments} />

        <Box flexShrink={{ base: 1, xl: 0 }}>
          {/* <Stack direction={{ base: 'row', md: 'column', xl: 'row' }} spacing="8px" mb="16px">
            <StarRating rating={4} />

            <Text fontSize="14px" color="mid-grey.400" whiteSpace="nowrap" mt="2px">
              {`4 (22 de review-uri)`}
            </Text>
          </Stack> */}

          <VariantChooser product={product} onVariantChange={(id) => setProductId(id)} />
        </Box>

        <Stack
          flexGrow="1"
          direction={{
            base: 'column',
            sm: 'column',
            md: 'row',
            lg: productHasVariants ? 'row' : 'column',
            xl: productHasVariants ? 'column' : 'row',
          }}
          alignItems={{
            base: 'flex-start',
            lg: productHasVariants ? 'flex-start' : 'flex-end',
            xl: productHasVariants ? 'flex-end' : 'flex-start',
          }}
          justifyContent={{
            base: 'flex-start',
            xl: productHasVariants ? 'flex-start' : 'flex-end',
          }}
          spacing="24px"
        >
          <Card p="24px" w="100%" maxW={{ base: 'unset', md: '460px' }}>
            <Stack spacing="16px">
              <Stack spacing="8px" direction="row" wrap="wrap">
                <Text as="h2" className="h1" color="primary.500" whiteSpace="nowrap">
                  {product && formatPriceWithCurrency(discountedPrice || price, currency)}
                </Text>
                {discountedPrice && (
                  <Text as="h2" className="h1" color="mid-grey.100" whiteSpace="nowrap" textDecoration="line-through">
                    {product && formatPriceWithCurrency(price, currency)}
                  </Text>
                )}
              </Stack>

              <Stack direction={{ base: 'column', sm: 'row' }} spacing="16px">
                <FieldMeta
                  w="auto"
                  content={
                    <CustomizedNumberInput
                      h="40px"
                      w={{ base: '100%', sm: 'min-content' }}
                      onChange={(value) => setProductQuantity(+value)}
                    />
                  }
                />

                <Button
                  flexGrow="1"
                  onClick={() => product?.id && addToCartMutation.mutate({ id: product.id, quantity: productQuantity })}
                >
                  <Text variant="capitalize-first">{t('buy')}</Text>
                </Button>
              </Stack>
            </Stack>
          </Card>

          {homeDeliveryTime && pickupTime && (
            <DeliveryCard
              w={{ base: 'auto', sm: '100%' }}
              maxW={{ base: 'unset', md: '460px' }}
              homeDeliveryTime={homeDeliveryTime}
              pickupTime={pickupTime}
            />
          )}
        </Stack>
      </Flex>
    </Stack>
  )
}

export default ProductInfo
