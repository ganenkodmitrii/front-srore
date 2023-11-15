import React, { forwardRef, useState, useEffect } from 'react'
import { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Trans } from 'react-i18next'

import { useParams, useRouter } from 'next/navigation'

import { Tabs, TabList, Flex, TabPanels, Textarea, Text, Checkbox, Box } from '@chakra-ui/react'

import { useMutation, useQuery } from '@tanstack/react-query'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { RadioTab, FieldMeta, CustomizedLink, PayPalModal } from '@/src/components'
import { useCart, useAuth } from '@/src/contexts'
import { useTranslation } from '@/src/i18n'
import { PaypalIcon } from '@/src/icons'
import models from '@/src/models'

export interface PaymentFormProps {
  register: UseFormRegister<models.CartFormValues>
  errors: FieldErrors<models.CartFormValues>
  handleSubmit: UseFormHandleSubmit<models.CartFormValues, undefined>
  setValue: UseFormSetValue<models.CartFormValues>
}

const PaymentForm = forwardRef<HTMLFormElement, PaymentFormProps>(function PaymentForm(
  { register, errors, handleSubmit, setValue },
  ref,
) {
  const { t } = useTranslation('checkout')
  const { t: tForm } = useTranslation('forms')
  const { lang } = useParams()
  const { cart, setCart } = useCart()
  const { isAuth } = useAuth()
  const [tabIndex, setTabIndex] = useState('')
  const router = useRouter()
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false)

  const { data: settings, isFetched } = useQuery({
    ...queries.settings.getAll(),
    select: (data) => {
      const results = data.results

      return {
        [models.Codenames.PAYPAL_IS_ACTIVE]: results.find((item) => item.codename === models.Codenames.PAYPAL_IS_ACTIVE)
          ?.value,
        [models.Codenames.PAY_ON_DELIVERY]: results.find((item) => item.codename === models.Codenames.PAY_ON_DELIVERY)
          ?.value,
      }
    },
  })

  const cashMutation = useMutation((body: models.CartFormValues) => api.cash(body), {
    onSuccess: (data: any) => {
      router.push(`/${lang}/checkout/final?status=success&id=${isAuth ? data.id : data.uid}`)
      setCart({ ...cart, products: [], cart_products: [] })
    },
    onError: () => router.push(`/${lang}/checkout/final?status=error`),
  })

  useEffect(() => {
    if (settings) {
      const availablePaymentMethods = Object.keys(settings).filter(
        (key) => settings[key as keyof typeof settings] === 'true',
      )
      setTabIndex(availablePaymentMethods[0])
      availablePaymentMethods.includes(models.Codenames.PAY_ON_DELIVERY)
        ? setValue('payment', 'cash')
        : setValue('payment', 'card')
    }
  }, [isFetched, settings, setValue])

  const requiredProps = { required: { value: true, message: tForm('required_field') } }
  register('payment')

  return (
    <Box
      ref={ref}
      as="form"
      onSubmit={handleSubmit((data) => {
        const isCashPayment = data.payment === 'cash'
        const newCart: models.CartFormValues = { ...cart, ...data }
        delete newCart.products
        if (isAuth) delete newCart.cart_products

        if (isCashPayment) {
          cashMutation.mutate(newCart)
        } else {
          setIsPayPalModalOpen(true)
        }
      })}
    >
      <Tabs isFitted variant="unstyled">
        <TabList gap="16px">
          {settings?.[models.Codenames.PAY_ON_DELIVERY] === 'true' && (
            <RadioTab
              maxW={{ base: 'auto', sm: '50%' }}
              isActive={tabIndex === models.Codenames.PAY_ON_DELIVERY}
              onClick={() => {
                setTabIndex(models.Codenames.PAY_ON_DELIVERY)
                setValue('payment', 'cash')
              }}
            >
              {t('cash_payment')}
            </RadioTab>
          )}

          {settings?.[models.Codenames.PAYPAL_IS_ACTIVE] === 'true' && (
            <RadioTab
              maxW={{ base: 'auto', sm: '50%' }}
              isActive={tabIndex === models.Codenames.PAYPAL_IS_ACTIVE}
              onClick={() => {
                setTabIndex(models.Codenames.PAYPAL_IS_ACTIVE)
                setValue('payment', 'card')
              }}
            >
              <Flex w="100%" justifyContent="space-between" alignItems="center">
                <span>PayPal</span>
                <PaypalIcon fontSize="24px" />
              </Flex>
            </RadioTab>
          )}
        </TabList>

        <TabPanels>
          <Box p="0" mt="24px">
            <FieldMeta
              error={errors.terms_and_conditions?.message}
              required
              content={
                <Checkbox size="lg" {...register('terms_and_conditions', requiredProps)}>
                  <Box fontSize="14px">
                    <Trans
                      i18nKey="forms.terms_and_conditions_checkbox"
                      components={{
                        link1: (
                          <CustomizedLink underlineOnHover color="primary.500" href={`/${lang}/terms-and-conditions`} />
                        ),
                      }}
                    />
                  </Box>
                </Checkbox>
              }
            />

            <FieldMeta
              mt="8px"
              content={
                <Checkbox size="lg" {...register('notifications')}>
                  <Text fontSize="14px">{tForm('notifications_checkbox')}</Text>
                </Checkbox>
              }
            />

            <FieldMeta
              mt="16px"
              label={tForm('comments')}
              error={errors.comment?.message}
              content={
                <Textarea variant="outline" placeholder={t('payment_textarea_placeholder')} {...register('comment')} />
              }
            />
          </Box>
        </TabPanels>
      </Tabs>

      <PayPalModal isOpen={isPayPalModalOpen} onClose={() => setIsPayPalModalOpen(false)} />
    </Box>
  )
})

export default PaymentForm
