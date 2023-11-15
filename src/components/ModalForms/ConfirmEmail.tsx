import React from 'react'
import { Trans } from 'react-i18next'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Divider, ModalBody, ModalCloseButton, ModalHeader, Button, ModalFooter } from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'

interface ConfirmEmailProps {
  translationKey: string
  onModalClose: React.Dispatch<boolean>
}

const ConfirmEmail = ({ translationKey, onModalClose }: ConfirmEmailProps) => {
  const { t } = useTranslation()
  const { lang } = useParams()
  return (
    <>
      <ModalHeader>{t('forms.check_email_address')}</ModalHeader>
      <ModalCloseButton />
      <Divider />
      <ModalBody py="16px" color="mid-grey.400">
        <Trans i18nKey={translationKey} components={{ br: <br /> }} />
      </ModalBody>
      <Divider />
      <ModalFooter>
        <Link href={`/${lang}/products`} style={{ width: '100%' }} onClick={() => onModalClose(true)}>
          <Button w="full">{t('forms.back_home_page')}</Button>
        </Link>
      </ModalFooter>
    </>
  )
}

export default ConfirmEmail
