import React from 'react'
import { useForm } from 'react-hook-form'

import { HStack, Input, VStack, Button, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { FieldMeta } from '@/src/components'
import { useTranslation } from '@/src/i18n'
import { CalendarIcon } from '@/src/icons'
import models from '@/src/models'

interface DetailsInputs {
  data?: models.User
}

const DetailsForm = ({ data }: DetailsInputs) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      last_name: data?.last_name,
      first_name: data?.first_name,
      phone_number: data?.phone_number,
      birthday: data?.birthday,
    },
  })

  const toast = useToast()
  const { t } = useTranslation('profile.details')
  const { t: tForm } = useTranslation('forms')
  const query = useQueryClient()
  const mutation = useMutation((data: models.FormData<models.User>) => api.profile.update(data))

  const onSubmit = () => {
    const credentials = getValues()
    mutation.mutate(
      { ...credentials, birthday: credentials.birthday ? dayjs(credentials.birthday).format('YYYY-MM-DD') : undefined },
      {
        onSuccess: () => {
          toast({ status: 'success', title: t('success_set_details') }),
            query.invalidateQueries(queries.profile.get().queryKey)
        },
        onError: () => toast({ status: 'error', title: t('error_set_details'), isClosable: true }),
      },
    )
  }

  return (
    <VStack as="form" gap="16px" align="left">
      <HStack gap="16px" align="flex-start">
        <FieldMeta
          label={t('surname')}
          error={errors.last_name?.message}
          required
          content={
            <Input
              border="1px solid #DDE2E4"
              {...register('last_name', {
                required: {
                  value: true,
                  message: t('surname_error'),
                },
              })}
            />
          }
        />
        <FieldMeta
          label={t('name')}
          error={errors.first_name?.message}
          required
          content={
            <Input
              border="1px solid #DDE2E4"
              {...register('first_name', {
                required: {
                  value: true,
                  message: t('name_error'),
                },
              })}
            />
          }
        />
      </HStack>

      <HStack gap="16px" align="flex-start">
        <FieldMeta
          label={t('phone')}
          error={errors.phone_number?.message}
          required
          content={
            <Input
              type="number"
              border="1px solid #DDE2E4"
              {...register('phone_number', {
                required: {
                  value: true,
                  message: t('phone_error'),
                },
                maxLength: {
                  value: 32,
                  message: tForm('phone_error_max_length'),
                },
              })}
            />
          }
        />
        <FieldMeta
          label={t('birthday')}
          content={
            <InputGroup>
              <Input type="date" placeholder="Select a date" border="1px solid #DDE2E4" {...register('birthday')} />
              <InputRightElement pointerEvents="none">
                <CalendarIcon fontSize="24px" />
              </InputRightElement>
            </InputGroup>
          }
        />
      </HStack>
      <Button
        variant="outline"
        onClick={handleSubmit(onSubmit)}
        type="submit"
        mt="8px"
        isLoading={mutation.isLoading}
        isDisabled={mutation.isLoading}
      >
        {t('save_changes')}
      </Button>
    </VStack>
  )
}

export default DetailsForm
