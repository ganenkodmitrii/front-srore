import React from 'react'

import { Button, Card, Text, Stack, CardProps, Spinner, Center } from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'
import { BigErrorIcon, BigHeartIcon, BigSearchIcon, BigOrderIcon } from '@/src/icons'

const icon = {
  'no-orders': <BigOrderIcon />,
  'no-results': <BigSearchIcon />,
  'no-favorites': <BigHeartIcon />,
  error: <BigErrorIcon />,
}

interface ResultCardProps extends CardProps {
  type: 'error' | 'no-results' | 'no-favorites' | 'no-orders'
  onReset?: () => void
  hideDescription?: boolean
  isLoading?: boolean
}

const ResultCard = ({ type, onReset, hideDescription = false, isLoading, ...props }: ResultCardProps) => {
  const { t } = useTranslation('result-card')

  return (
    <Card
      {...props}
      minH="432px"
      display="grid"
      placeItems="center"
      p={{
        base: '0px',
        sm: '16px 64px 64px',
      }}
    >
      {isLoading ? (
        <Center mt="48px">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="primary.500" size="xl" />
        </Center>
      ) : (
        <Stack justifyItems="center" alignItems="center">
          <div>{icon[type]}</div>

          <Text as="h3">{t(`${type}.title`)}</Text>

          {!hideDescription && (
            <Text textAlign="center" mt="16px" color="mid-grey.400">
              {t(`${type}.description`)}
            </Text>
          )}

          {onReset && (
            <Button mt="24px" onClick={onReset}>
              {t(type === 'error' ? 'try_again' : type === 'no-results' ? 'reset_search' : 'view_product_feed')}
            </Button>
          )}
        </Stack>
      )}
    </Card>
  )
}

export default ResultCard
