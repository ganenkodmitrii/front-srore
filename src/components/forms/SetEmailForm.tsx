import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { VStack, Input, Button, useToast } from '@chakra-ui/react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { EMAIL_REGEX } from '@/src/app-constants'
import { FieldMeta, PasswordInput } from '@/src/components'
import models from '@/src/models'

interface SettingsEmailFormValues {
  currentPassword: string
  newEmail: string
}

const SetEmailForm = () => {
  const {
    register,
    control,
    reset,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SettingsEmailFormValues>()
  const { t } = useTranslation()
  const toast = useToast()
  const queryClient = useQueryClient()

  const resetFields = () =>
    reset({
      currentPassword: '',
      newEmail: '',
    })

  const succesToast = () =>
    toast({
      isClosable: false,
      status: 'success',
      description: t('profile.settings.success_set_email'),
    })

  const errorToast = () =>
    toast({
      isClosable: false,
      status: 'error',
      description: t('something_got_wrong'),
    })

  const mutation = useMutation({
    mutationFn: (credentials: models.SetNewEmail) => api.profile.setEmail(credentials),
    onSuccess: () => {
      succesToast
      queryClient.invalidateQueries(queries.profile.get().queryKey)
      resetFields()
    },
    onError: (error: AxiosError<models.SetNewEmail>) => {
      resetFields()
      error?.response?.data.current_password
        ? setError('currentPassword', { type: 'custom', message: t('forms.invalid_password') })
        : errorToast()
    },
  })

  const onSubmit = () => {
    const credentials = getValues()
    mutation.mutate({ current_password: credentials.currentPassword, new_email: credentials.newEmail })
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
        label={t('profile.settings.new_email')}
        error={errors.newEmail?.message}
        required
        content={
          <Input
            {...register('newEmail', {
              required: {
                value: true,
                message: t('profile.settings.new_email_error'),
              },
              pattern: {
                value: EMAIL_REGEX,
                message: t('invalid_email_address'),
              },
            })}
          />
        }
      />

      <Button
        variant="outline"
        onClick={handleSubmit(onSubmit)}
        type="submit"
        isLoading={mutation.isLoading}
        isDisabled={mutation.isLoading}
      >
        {t('profile.settings.change_email')}
      </Button>
    </VStack>
  )
}

export default SetEmailForm
