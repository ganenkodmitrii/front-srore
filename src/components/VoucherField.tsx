import React, { Fragment, useState } from 'react'

import { Stack, Input, Button, HStack, Text, Tag, TagLabel, TagCloseButton, useToast } from '@chakra-ui/react'

import { useMutation } from '@tanstack/react-query'

import api from '../api'
import { useCart } from '../contexts'
import { useTranslation } from '../i18n'
import models from '../models'

import FieldMeta from './FieldMeta'

const VoucherField = () => {
  const [voucherCode, setVoucherCode] = useState('')
  const { t } = useTranslation('checkout')
  const { cart, setCart } = useCart()
  const toast = useToast()

  const mutation = useMutation(async (body: models.Cart) => api.cart.calculate(body), {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: t('voucher_code_applied'),
        status: 'success',
        isClosable: true,
      })
    },
  })

  const onApply = () => {
    const newCart = { ...cart, voucher_codes: [...(cart.voucher_codes || []), voucherCode] }
    setCart(newCart)
    mutation.mutate(newCart)
    setVoucherCode('')
  }

  return (
    <>
      <FieldMeta
        label={t('voucher')}
        mb="8px"
        content={
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={{ base: '8px', xl: '16px' }}>
            <Input
              placeholder={t('enter_voucher_code')}
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onApply()
              }}
            />
            <Button size="sm" variant="white" color="dark-grey.400" isDisabled={!voucherCode} onClick={onApply}>
              {t('apply')}
            </Button>
          </Stack>
        }
      />

      {!!cart.voucher_codes?.length && (
        <Text>
          {t('voucher_codes')}: {cart.voucher_codes?.length}
        </Text>
      )}

      <HStack gap="10px" wrap="wrap">
        {cart.voucher_codes?.map((code) => (
          <Tag key={code} borderRadius="full" variant="solid" colorScheme="green">
            <TagLabel>{code}</TagLabel>
            <TagCloseButton
              onClick={() => {
                if (cart?.voucher_codes) {
                  const updatedVoucherCodes = cart.voucher_codes.filter((c) => c !== code)
                  setCart({ ...cart, voucher_codes: updatedVoucherCodes })
                }
              }}
            />
          </Tag>
        ))}
      </HStack>
    </>
  )
}

export default VoucherField
