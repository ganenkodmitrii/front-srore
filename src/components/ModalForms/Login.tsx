'use client'

import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import {
  Divider,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  VStack,
  Button,
  HStack,
  Text,
  Spinner,
  Center,
} from '@chakra-ui/react'

import { useMutation } from '@tanstack/react-query'

import api from '@/src/api'
import { EMAIL_REGEX } from '@/src/app-constants'
import { FieldMeta, PasswordInput } from '@/src/components'
import { UserContext } from '@/src/contexts'
import { useTranslation } from '@/src/i18n'
import models from '@/src/models'
interface LoginProps {
  redirectUrlForGuest?: string
  onRegisterClick: () => void
  onResetPasswordClick: () => void
  onCloseModal: () => void
}

const Login = ({ redirectUrlForGuest, onRegisterClick, onResetPasswordClick, onCloseModal }: LoginProps) => {
  const router = useRouter()
  const context = React.useContext(UserContext)

  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    formState: { errors },
  } = useForm<models.LoginCredentials>()

  const mutation = useMutation((credentials: models.LoginCredentials) => api.auth.login(credentials))

  const onSubmit = () => {
    const credentials = getValues()
    mutation.mutate(credentials, {
      onError: () => setError('password', { type: 'custom', message: t('forms.not_found_account') }),
      onSuccess: async () => {
        onCloseModal()
        context.setIsAuth(true)
        const user = await api.profile.get()
        context.setUser(user)
      },
    })
  }

  return (
    <>
      <ModalHeader>{t('forms.log_in_account')}</ModalHeader>
      <ModalCloseButton />
      <Divider />

      {redirectUrlForGuest && (
        <ModalBody py="16px" pb="0">
          <Button
            onClick={() => {
              router.push(redirectUrlForGuest)
              onCloseModal()
            }}
            size="sm"
            w="full"
            variant="white"
            mb="16px"
          >
            {t('forms.continue_without_account')}
          </Button>
          <Divider />
        </ModalBody>
      )}

      {mutation.isLoading ? (
        <Center w="full" h="full" my="24px">
          <Spinner />
        </Center>
      ) : (
        <ModalBody py="16px">
          <VStack as="form" onSubmit={handleSubmit(onSubmit)} gap="16px">
            <FieldMeta
              label={t('forms.email')}
              error={errors.email?.message}
              required
              content={
                <Input
                  size="sm"
                  {...register('email', {
                    required: {
                      value: true,
                      message: t('forms.invalid_email'),
                    },
                    pattern: {
                      value: EMAIL_REGEX,
                      message: t('forms.invalid_email_address'),
                    },
                  })}
                />
              }
            />

            <VStack gap="4px" w="full" align="left">
              <FieldMeta
                label={t('forms.password')}
                error={errors.password?.message}
                required
                content={
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: { value: true, message: t('forms.password_required') } }}
                    render={({ field }) => <PasswordInput {...field} size="sm" />}
                  />
                }
              />
              <Text fontSize="12px" color="primary.500" onClick={onResetPasswordClick} cursor="pointer">
                {t('forms.forgot_password')}
              </Text>
            </VStack>

            <VStack gap="8px" w="full">
              <Button size="sm" type="submit" w="full">
                {t('forms.log_in')}
              </Button>
              <HStack gap="4px" fontSize="12px">
                <Text>{t('forms.not_have_account')}</Text>
                <Text color="primary.500" cursor="pointer" onClick={onRegisterClick}>
                  {t('forms.create_new_one')}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>
      )}
    </>
  )
}

export default Login
