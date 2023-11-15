import { Card, Stack, StackDivider, Grid, HStack, Text, useTheme, CardProps } from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'
import { ArchiveIcon, TruckDeliveryIcon } from '@/src/icons'

interface DeliveryCardProps extends CardProps {
  homeDeliveryPrice?: number | string
  homeDeliveryTime?: string
  homeDeliveryCurrency?: string
  pickupPrice?: number | string
  pickupTime?: string
  pickupCurrency?: string
}

export const DeliveryCard = ({
  homeDeliveryPrice,
  homeDeliveryTime,
  homeDeliveryCurrency,
  pickupPrice,
  pickupTime,
  pickupCurrency,
  ...props
}: DeliveryCardProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const midGrey = theme.colors['mid-grey'][400]
  const iconProps = { fontSize: '24px', color: midGrey, style: { flexShrink: 0 } }

  return (
    <Card {...props}>
      <Stack p="24px" divider={<StackDivider bgColor="gray.200" />}>
        <Grid
          templateColumns={{
            base: '2fr 1fr 1fr',
            xl: '3fr 1fr 1fr',
          }}
          gap="16px"
        >
          <HStack spacing="8px" alignItems="flex-start">
            <ArchiveIcon {...iconProps} />
            <span>{t('pickup_at_office')}</span>
          </HStack>
          {pickupTime && (
            <Text as="span" whiteSpace="nowrap">
              {pickupTime} {t('products.days')}
            </Text>
          )}
          <Text as="span" ml="auto" whiteSpace="nowrap">
            {pickupPrice} {pickupCurrency}
          </Text>
        </Grid>

        <Grid
          templateColumns={{
            base: '2fr 1fr 1fr',
            xl: '3fr 1fr 1fr',
          }}
          gap="16px"
        >
          <HStack spacing="8px" alignItems="flex-start">
            <TruckDeliveryIcon {...iconProps} />
            <span>{t('home_delivery')}</span>
          </HStack>
          {homeDeliveryTime && (
            <Text as="span" whiteSpace="nowrap">
              {homeDeliveryTime} {t('products.days')}
            </Text>
          )}
          <Text as="span" ml="auto" whiteSpace="nowrap">
            {homeDeliveryPrice} {homeDeliveryCurrency}
          </Text>
        </Grid>
      </Stack>
    </Card>
  )
}

export default DeliveryCard
