'use client'

import React from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  Center,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Spinner,
  Text,
} from '@chakra-ui/react'

import { useMutation } from '@tanstack/react-query'

import api from '@/src/api'
import { useTranslation } from '@/src/i18n'
import { MailIcon } from '@/src/icons'

import { FieldMeta } from '../'

interface ResetPasswordProps {
  onLoginClick: () => void
  onResetPasswordSuccess: () => void
}

const ResetPassword = ({ onResetPasswordSuccess, onLoginClick }: ResetPasswordProps) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<{ email: string }>()

  const mutation = useMutation((email: string) => api.auth.resetPassword(email))

  const onSubmit = () => {
    const email = getValues('email')
    mutation.mutate(email, {
      onSuccess: onResetPasswordSuccess,
      onError: () => setError('email', { type: 'custom', message: t('forms.invalid_email_address') }),
    })
  }

  return (
    <>
      <ModalHeader>{t('forms.reset_password')}</ModalHeader>
      <ModalCloseButton />
      <Divider />
      {mutation.isLoading ? (
        <Center w="full" h="full" my="24px">
          <Spinner />
        </Center>
      ) : (
        <>
          <ModalBody py="16px">
            <Text color="mid-grey.400" fontSize="16px" mb="16px">
              {t('forms.reset_password_instructions')}
            </Text>
            <FieldMeta
              label={t('forms.email')}
              error={errors.email?.message}
              required
              content={
                <InputGroup>
                  <Input
                    placeholder={t('forms.email_placeholder')}
                    {...register('email', {
                      required: { value: true, message: t('forms.invalid_email') },
                    })}
                  />
                  <InputRightElement pointerEvents="none">
                    <MailIcon fontSize={24} />
                  </InputRightElement>
                </InputGroup>
              }
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <HStack w="full">
              <Button variant="outline" flex={1} onClick={onLoginClick}>
                {t('forms.log_in')}
              </Button>
              <Button onClick={handleSubmit(onSubmit)} flex={1}>
                {t('forms.send_email')}
              </Button>
            </HStack>
          </ModalFooter>
        </>
      )}
    </>
  )
}
export default ResetPassword
