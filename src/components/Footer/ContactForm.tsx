import { useForm, SubmitHandler } from 'react-hook-form'
import { Trans } from 'react-i18next'

import { Button, Checkbox, Input, Textarea, Box, Stack, useToast } from '@chakra-ui/react'

import { useMutation } from '@tanstack/react-query'

import api from '@/src/api'
import { EMAIL_REGEX } from '@/src/app-constants'
import { CustomizedLink, FieldMeta } from '@/src/components'
import { useTranslation } from '@/src/i18n'
import models from '@/src/models'

interface ContactFormValues extends models.Message {
  terms: boolean
}

export const ContactForm = () => {
  const { t, i18n } = useTranslation()
  const { t: tForm } = useTranslation('forms')
  const toast = useToast()

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>()

  const errorToast = () =>
    toast({
      status: 'error',
      isClosable: false,
      description: t('something_got_wrong'),
    })

  const successToast = () =>
    toast({
      isClosable: false,
      status: 'success',
      description: t('forms.message_sent_successfully'),
    })

  const mutation = useMutation((data: models.Message) => api.contact.post(data))

  const onSubmit: SubmitHandler<ContactFormValues> = (data) => {
    mutation.mutate(data, {
      onError: errorToast,
      onSuccess: () => {
        reset(), successToast()
      },
    })
  }

  return (
    <Stack as="form" alignItems="stretch" gap="16px" onSubmit={handleSubmit(onSubmit)}>
      <h2>{tForm('contact_us')}</h2>
      <Stack direction={{ base: 'column', md: 'row' }} gap="16px">
        <Box flexGrow={1}>
          <FieldMeta
            mode="dark"
            label={tForm('name')}
            error={errors.name?.message}
            content={
              <Input
                {...register('name', {
                  required: {
                    value: true,
                    message: tForm('required_field'),
                  },
                })}
              />
            }
          />
        </Box>

        <Box flexGrow={1}>
          <FieldMeta
            label={tForm('email')}
            mode="dark"
            error={errors.email?.message}
            content={
              <Input
                {...register('email', {
                  required: tForm('required_field'),
                  pattern: {
                    value: EMAIL_REGEX,
                    message: tForm('invalid_email_address'),
                  },
                })}
              />
            }
          />
        </Box>

        <Box flexGrow={1}>
          <FieldMeta
            mode="dark"
            label={tForm('phone')}
            error={errors.phone_number?.message}
            content={
              <Input
                type="number"
                {...register('phone_number', {
                  pattern: {
                    value: /^[0-9]*$/,
                    message: tForm('invalid_phone_number'),
                  },
                  maxLength: {
                    value: 32,
                    message: tForm('phone_error_max_length'),
                  },
                })}
              />
            }
          />
        </Box>
      </Stack>

      <Box>
        <FieldMeta
          label={tForm('message')}
          mode="dark"
          error={errors.message?.message}
          content={
            <Textarea
              {...register('message', {
                required: { value: true, message: tForm('required_field') },
                pattern: {
                  value: /^.{0,500}$/,
                  message: tForm('max_length_500'),
                },
              })}
            />
          }
        />
      </Box>
      <FieldMeta
        error={errors.terms?.message}
        mode="dark"
        required
        content={
          <Checkbox
            {...register('terms', {
              required: {
                value: true,
                message: tForm('accept_terms_and_conditions_and_privacy_policy'),
              },
            })}
          >
            <Trans
              i18nKey="terms_and_conditions_checkbox"
              components={{
                link1: (
                  <CustomizedLink
                    underlineOnHover
                    color="primary.500"
                    href={`/${i18n.language}/terms-and-conditions`}
                  />
                ),
                link2: (
                  <CustomizedLink underlineOnHover color="primary.500" href={`/${i18n.language}/privacy-policy`} />
                ),
              }}
            />
          </Checkbox>
        }
      />

      <Button type="submit" width="100%">
        {tForm('send_a_message')}
      </Button>
    </Stack>
  )
}
