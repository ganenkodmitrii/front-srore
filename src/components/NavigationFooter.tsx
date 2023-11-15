import Link from 'next/link'

import { Stack, Button, StackProps } from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'

interface NavigationFooterProps extends StackProps {
  onNext: () => void
  buttonName?: string
}

const NavigationFooter = ({ onNext, buttonName, ...props }: NavigationFooterProps) => {
  const { t } = useTranslation('checkout')

  return (
    <Stack direction="row" ml="auto" w={{ base: '100%', sm: 'auto' }} {...props}>
      <Button as={Link} href="/" width={{ base: '100%', sm: 'auto' }} size="sm" variant="white">
        {t('quit')}
      </Button>

      <Button onClick={onNext} width={{ base: '100%', sm: 'auto' }} size="sm">
        {buttonName ? buttonName : t('continue')}
      </Button>
    </Stack>
  )
}

export default NavigationFooter
