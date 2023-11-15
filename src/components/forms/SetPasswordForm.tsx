'use client'

import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { VStack, Button, useToast } from '@chakra-ui/react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import api from '@/src/api'
import queries from '@/src/api/queries'
import models from '@/src/models'

import { FieldMeta, PasswordInput } from '../'
interface SettingsPasswordFormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const SetPasswordForm = () => {
  const {
    handleSubmit,
    getValues,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<SettingsPasswordFormValues>()

  const toast = useToast()
  const { t } = useTranslation()
  const credentials = getValues()
  const queryClient = useQueryClient()

  const resetFields = () =>
    reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })

  const successToast = () =>
    toast({
      isClosable: false,
      status: 'success',
      description: t('profile.settings.success_set_password'),
    })

  const errorToast = () =>
    toast({
      isClosable: false,
      status: 'error',
      description: t('something_got_wrong'),
    })

  const mutation = useMutation({
    mutationFn: () =>
      api.profile.setPassword({ current_password: credentials.currentPassword, new_password: credentials.newPassword }),
    onSuccess: () => {
      successToast()
      resetFields()
      queryClient.invalidateQueries(queries.profile.get().queryKey)
    },
    onError: (error: AxiosError<models.SetNewPassword>) => {
      resetFields()
      error?.response?.data.current_password
        ? setError('currentPassword', { type: 'custom', message: t('forms.invalid_password') })
        : errorToast()
    },
  })

  const onSetPasswordSubmit = () => {
    const credentials = getValues()
    if (credentials.newPassword !== credentials.confirmPassword) {
      setError('confirmPassword', { type: 'custom', message: t('forms.invalid_confirm_password') })
      return
    }
    mutation.mutate()
  }

  return (
    <VStack as="form" gap="16px" align="left">
      <FieldMeta
        label={t('profile.settings.current_password')}
        error={errors?.currentPassword?.message}
        required
        content={
          <Controller
            name="currentPassword"
            control={control}
            rules={{ required: { value: true, message: t('profile.settings.current_password_error') } }}
            render={({ field }) => <PasswordInput {...field} size="sm" />}
          />
        }
      />

      <FieldMeta
        label={t('profile.settings.new_password')}
        error={errors?.newPassword?.message}
        required
        content={
          <Controller
            name="newPassword"
            control={control}
            rules={{ required: { value: true, message: t('profile.settings.new_password_error') } }}
            render={({ field }) => <PasswordInput {...field} size="sm" />}
          />
        }
      />

      <FieldMeta
        label={t('profile.settings.confirm_password')}
        error={errors?.confirmPassword?.message}
        required
        content={
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: { value: true, message: t('profile.settings.confirm_password_error') } }}
            render={({ field }) => <PasswordInput {...field} size="sm" />}
          />
        }
      />

      <Button
        variant="outline"
        onClick={handleSubmit(onSetPasswordSubmit)}
        type="submit"
        isLoading={mutation.isLoading}
        isDisabled={mutation.isLoading}
      >
        {t('profile.settings.change_password')}
      </Button>
    </VStack>
  )
}

export default SetPasswordForm
