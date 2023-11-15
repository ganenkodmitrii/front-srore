import { useContext } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { Card, Center, HStack, Text, Button } from '@chakra-ui/react'

import { UserContext } from '@/src/contexts'
import { useTranslation } from '@/src/i18n'
import { CartIcon, CreditCardIcon } from '@/src/icons'

interface CheckoutFinalCardProps {
  status: string | null
  orderId: string | null
}

const CheckoutFinalCard = ({ status, orderId }: CheckoutFinalCardProps) => {
  const { t } = useTranslation('checkout')
  const router = useRouter()
  const { lang } = useParams()
  const { isAuth } = useContext(UserContext)

  const onSecondaryButtonClick = () => router.replace('/')

  const onButtonClick = () => {
    if (status === 'success') {
      router.push(`/${lang}${isAuth ? '/profile' : ''}/orders/${orderId}`)
    } else router.back()
  }

  return (
    <Card p="40px" minW={{ base: 'none', md: '680px' }}>
      <Center
        w="88px"
        h="88px"
        mx="auto"
        bg={status === 'success' ? 'primary.500' : 'red.600'}
        borderRadius="8px"
        fontSize="56px"
        color="#fff"
        mb="28px"
      >
        {status === 'success' ? (
          <CartIcon style={{ strokeWidth: '2.5px' }} />
        ) : (
          <CreditCardIcon style={{ strokeWidth: '2.5px' }} />
        )}
      </Center>
      <Text fontWeight="600" fontSize="24px" color="dark-grey.400" textAlign="center" mb="24px">
        {t(`order_${status}`)}
      </Text>

      <HStack gap="8px" flexWrap="wrap">
        <Button variant="outline" size="sm" flex="1 1 200px" onClick={onSecondaryButtonClick}>
          {t(status === 'success' ? 'continue_shopping' : 'refuse')}
        </Button>
        <Button size="sm" flex="1 1 200px" onClick={onButtonClick}>
          {t(status === 'success' ? 'order_details' : 'check_data')}
        </Button>
      </HStack>
    </Card>
  )
}

export default CheckoutFinalCard
