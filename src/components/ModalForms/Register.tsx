import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'

import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Divider,
  VStack,
  HStack,
  Input,
  Checkbox,
  Text,
  Button,
  Center,
  Spinner,
} from '@chakra-ui/react'

import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import api from '@/src/api'
import { EMAIL_REGEX } from '@/src/app-constants'
import { CustomizedLink, FieldMeta, PasswordInput } from '@/src/components'
import { useTranslation } from '@/src/i18n'
import models from '@/src/models'
interface RegisterProps {
  onLoginClick: () => void
  onRegisterSuccess: () => void
}

interface RegisterType extends models.RegisterCredentials {
  confirmPassword: string
  accept_terms: boolean
}

const Register = ({ onLoginClick, onRegisterSuccess }: RegisterProps) => {
  const { t, i18n } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    watch,
    formState: { errors },
  } = useForm<RegisterType>()

  watch()
  const credentials = getValues()

  const mutation = useMutation((credentials: models.RegisterCredentials) => api.auth.register(credentials))

  const onSubmit = () => {
    if (credentials.confirmPassword !== credentials.password) {
      setError('confirmPassword', { type: 'custom', message: t('forms.invalid_confirm_password') })
      return
    }
    mutation.mutate(credentials, {
      onSuccess: onRegisterSuccess,
      onError: (err) => {
        if (isAxiosError(err)) {
          if (err.response?.data.email) {
            setError('email', { message: t('forms.email_already_used') })
          } else if (err.response?.data.password) {
            setError('password', { message: err.response.data.password })
          } else {
            setError('accept_terms', { message: t('something_went_wrong') })
          }
        } else {
          setError('accept_terms', { message: t('something_went_wrong') })
        }
      },
    })
  }

  return (
    <>
      <ModalHeader>{t('forms.register')}</ModalHeader>
      <ModalCloseButton />
      <Divider />
      {mutation.isLoading ? (
        <Center w="full" h="full" my="24px">
          <Spinner />
        </Center>
      ) : (
        <ModalBody py="16px">
          <VStack gap="16px" align="left" as="form">
            <HStack gap="16px" align="start" flexDirection={i18n.language === 'en' ? 'row-reverse' : 'row'}>
              <FieldMeta
                label={t('forms.last_name')}
                error={errors.last_name?.message}
                required
                content={
                  <Input
                    {...register('last_name', { required: { value: true, message: t('forms.invalid_last_name') } })}
                    size="sm"
                  />
                }
              />
              <FieldMeta
                label={t('forms.first_name')}
                error={errors.first_name?.message}
                required
                content={
                  <Input
                    {...register('first_name', { required: { value: true, message: t('forms.invalid_first_name') } })}
                    size="sm"
                  />
                }
              />
            </HStack>

            <FieldMeta
              label={t('forms.email')}
              error={errors.email?.message}
              required
              content={
                <Input
                  size="sm"
                  {...register('email', {
                    required: { value: true, message: t('forms.invalid_email') },
                    pattern: {
                      value: EMAIL_REGEX,
                      message: t('forms.invalid_email_address'),
                    },
                  })}
                />
              }
            />

            <FieldMeta
              label={t('forms.password')}
              error={errors.password?.message}
              required
              content={
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('forms.password_required'),
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:;<>,.?/~])(.{7,})$/,
                      message: t('forms.invalid_password_pattern'),
                    },
                  }}
                  render={({ field }) => <PasswordInput {...field} size="sm" />}
                />
              }
            />

            <FieldMeta
              label={t('forms.confirm_password')}
              error={errors.confirmPassword?.message}
              required
              content={
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => <PasswordInput {...field} size="sm" />}
                />
              }
            />
            <FieldMeta
              error={errors.accept_terms?.message}
              content={
                <Checkbox
                  {...register('accept_terms', {
                    required: { value: true, message: t('forms.invalid_register_checkbox') },
                  })}
                >
                  <Text fontSize="14px">
                    <Trans
                      i18nKey="forms.register_checkbox"
                      components={{
                        link1: (
                          <CustomizedLink
                            underlineOnHover
                            color="primary.500"
                            href={`/${i18n.language}/terms-and-conditions`}
                          />
                        ),
                      }}
                    />
                  </Text>
                </Checkbox>
              }
            />
          </VStack>
          <Divider my="16px" />
          <HStack gap="8px">
            <Button variant="outline" flex={1} onClick={onLoginClick}>
              {t('forms.log_in')}
            </Button>
            <Button flex={1} onClick={handleSubmit(onSubmit)} isDisabled={!getValues('accept_terms')}>
              {t('forms.register')}
            </Button>
          </HStack>
        </ModalBody>
      )}
    </>
  )
}

export default Register
