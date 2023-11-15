import Image from 'next/image'
import Link from 'next/link'

import { Badge, Box, Card, CardBody, CardProps, Center, Flex, HStack, Text } from '@chakra-ui/react'

import { Currency, formatPriceWithCurrency } from '@/src/business'
import { useTranslation } from '@/src/i18n'
import { isValidImage } from '@/src/utils'

interface ProductCardProps extends CardProps {
  image: string
  name: string
  slug: string
  description: string
  price: number
  discountedPrice?: number | null
  discountPercent: number
  currency: Currency
  footer?: React.ReactNode
  iconButton: React.ReactNode
  onDelete?: (args: number) => void
}

const ProductCard = ({
  image,
  name,
  slug,
  description,
  price,
  discountedPrice,
  discountPercent = 0,
  currency,
  iconButton,
  footer,
  ...props
}: ProductCardProps) => {
  const { t } = useTranslation()

  return (
    <Card overflow="hidden" pos="relative" {...props}>
      <Link href={`/products/${slug}`}>
        <Center bg="light-grey.400" w="100%" h="196px" overflow="hidden" pos="relative">
          {isValidImage(image) && <Image fill src={image} alt={name} style={{ objectFit: 'cover' }} />}
        </Center>
      </Link>
      <HStack pos="absolute" left="16px" top="20px">
        <Badge colorScheme="primary" variant="solid" size="md">
          {t('top')}
        </Badge>
        {discountPercent && (
          <Badge colorScheme="primary" variant="red" size="md">
            -{discountPercent.toFixed()}%
          </Badge>
        )}
      </HStack>
      <Box pos="absolute" right="16px" top="20px">
        {iconButton}
      </Box>
      <CardBody display="flex" flexDirection="column" gap="16px">
        <div>
          <Text variant="ellipsis" color="dark-grey.400" fontSize="16px" lineHeight="24px">
            <Link href={`/products/${slug}`}>{name}</Link>
          </Text>

          <Text variant="ellipsis" color="mid-grey.100" fontSize="12px" lineHeight="16px">
            {description}
          </Text>
        </div>

        <Flex gap="8px" fontWeight="600" fontSize="18px" lineHeight="24px">
          <Text color="dark-grey.400">{formatPriceWithCurrency(discountedPrice || price, currency)}</Text>
          {discountedPrice && (
            <Text color="mid-grey.100" textDecoration="line-through">
              {formatPriceWithCurrency(price, currency)}
            </Text>
          )}
        </Flex>
        {footer && <Box mt="auto">{footer}</Box>}
      </CardBody>
    </Card>
  )
}

export default ProductCard
