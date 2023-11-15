import React from 'react'
import { useForm, Controller } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import {
  Center,
  Spinner,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Box,
  Text,
  UnorderedList,
  ListItem,
  Divider,
  ModalFooter,
  Button,
} from '@chakra-ui/react'

import { useMutation } from '@tanstack/react-query'
import { t } from 'i18next'

import api from '@/src/api'
import models from '@/src/models'

import { FieldMeta, PasswordInput } from '../'

type SetPasswordType = {
  new_password: string
  new_password_confirm: string
}

interface SetNewPasswordProps {
  uid: string
  token: string
  onSuccess: () => void
}

const SetNewPassword = ({ uid, token, onSuccess }: SetNewPasswordProps) => {
  const router = useRouter()

  const {
    getValues,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SetPasswordType>()

  const mutation = useMutation((credentials: models.ResetPasswordConfirmation) =>
    api.auth.resetPasswordConfirm(credentials),
  )

  const onSubmit = () => {
    const formData = getValues()

    if (formData.new_password !== formData.new_password_confirm) {
      setError('new_password_confirm', { type: 'custom', message: t('forms.invalid_confirm_password') })
      return
    }

    const credentials = {
      uid,
      token,
      new_password: formData.new_password,
    }

    mutation.mutate(credentials, {
      onSuccess: () => {
        onSuccess()
        router.push('/')
      },
    })
  }

  return (
    <>
      <ModalHeader>{t('forms.create_new_password')}</ModalHeader>
      <ModalCloseButton />
      <Divider />
      {mutation.isLoading ? (
        <Center w="full" h="full">
          <Spinner my="24px" />
        </Center>
      ) : (
        <>
          <ModalBody py="16px">
            <VStack gap="16px" align="left">
              <Box color="mid-grey.400">
                <Text mb="10px">{t('forms.new_password_title')}</Text>
                <UnorderedList px="6px">
                  {[...Array(3)].map((_, idx) => (
                    <ListItem key={idx}>{t(`forms.new_password_rule${idx + 1}`)}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
              <FieldMeta
                label={t('forms.new_password')}
                error={errors.new_password?.message}
                required
                content={
                  <Controller
                    name="new_password"
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
                label={t('forms.new_password_confirm')}
                error={errors.new_password_confirm?.message}
                required
                content={
                  <Controller
                    name="new_password_confirm"
                    control={control}
                    render={({ field }) => <PasswordInput {...field} size="sm" />}
                  />
                }
              />
            </VStack>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button onClick={handleSubmit(onSubmit)} w="full">
              {t('forms.confirm')}
            </Button>
          </ModalFooter>
        </>
      )}
    </>
  )
}

export default SetNewPassword
