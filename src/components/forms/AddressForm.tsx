import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useParams, useRouter } from 'next/navigation'

import { Card, Stack, Text, Input, Button, Box, Textarea, Checkbox, useToast } from '@chakra-ui/react'

import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { userAddress } from '@/src/api/user-address'
import { EMAIL_REGEX } from '@/src/app-constants'
import { defaultSelectPagination } from '@/src/business'
import { FieldMeta, SelectOptions } from '@/src/components'
import { useTranslation } from '@/src/i18n'
import models from '@/src/models'

interface Props {
  data?: models.UserAccountAddress
}

const AddressForm = ({ data }: Props) => {
  const { t: tForm } = useTranslation('forms')
  const { t } = useTranslation()
  const { id } = useParams()
  const route = useRouter()
  const query = useQueryClient()
  const toast = useToast()

  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...data,
      address: {
        ...data?.address,
        country: data?.address.country?.id || null,
        region: data?.address?.region?.id || null,
        city: data?.address?.city?.id || null,
      },
    },
  })

  const country = watch('address.country')
  const region = watch('address.region')

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.includes('address.country')) {
        reset({
          ...getValues(),
          address: {
            ...value.address,
            region: null,
            city: null,
          },
        })
      }
      if (name?.includes('address.region')) {
        reset({
          ...getValues(),
          address: {
            ...value.address,
            city: null,
          },
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [reset, watch, getValues])

  const [{ data: countries }, { data: regions }, { data: cities }] = useQueries({
    queries: [
      {
        ...queries.addresses.getAllCountries(),
      },
      {
        ...queries.addresses.getPaginatedRegions({ ...defaultSelectPagination, country_id: country }),
        enabled: Boolean(country),
      },
      {
        ...queries.addresses.getPaginatedCities({
          ...defaultSelectPagination,
          country_id: country,
          region_id: region,
        }),
        enabled: Boolean(region) && Boolean(country),
      },
    ],
  })

  const { mutate, isLoading: isLoadingMutate } = useMutation(
    (address: models.FormData<models.UserAccountAddress>) => {
      return id ? userAddress.update(Number(id), address) : userAddress.create(address)
    },
    {
      onSuccess: () => {
        if (id) {
          query.invalidateQueries(queries.userAddress.getById(Number(id)).queryKey)
        }
        route.push(`/profile/addresses`)
      },
      onError: () =>
        toast({
          status: 'error',
          description: t('something_got_wrong'),
          isClosable: false,
        }),
    },
  )

  const onSubmit = () => {
    const data: models.FormData<any> = getValues()

    Object.entries(data.address).forEach(([key, value]) => {
      if (value === '') data.address[key] = null
    })

    mutate(data)
  }

  return (
    <Stack spacing="40px">
      <Card p="24px" display="flex" gap="24px">
        <Text as="h4">{tForm('contact')}</Text>
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }}
          gap="16px"
        >
          <FieldMeta
            label={tForm('first_name')}
            error={errors.address?.first_name?.message}
            required
            content={
              <Input
                {...register('address.first_name', { required: { value: true, message: tForm('required_field') } })}
              />
            }
          />
          <FieldMeta
            label={tForm('last_name')}
            error={errors.address?.last_name?.message}
            required
            content={
              <Input
                {...register('address.last_name', { required: { value: true, message: tForm('required_field') } })}
              />
            }
          />

          <FieldMeta
            label={tForm('email')}
            error={errors.address?.email?.message}
            required
            content={
              <Input
                {...register('address.email', {
                  required: { value: true, message: tForm('required_field') },
                  pattern: {
                    value: EMAIL_REGEX,
                    message: tForm('invalid_email_address'),
                  },
                })}
              />
            }
          />
          <FieldMeta
            label={tForm('phone')}
            error={errors.address?.phone?.message}
            required
            content={
              <Input
                type="number"
                {...register('address.phone', {
                  required: { value: true, message: tForm('required_field') },
                  pattern: {
                    value: /^\+?[0-9]+$/,
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
      </Card>

      <Card p="24px" boxShadow="" display="flex" gap="24px">
        <Text as="h4">{tForm('address')}</Text>

        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }}
          gap="16px"
        >
          <FieldMeta
            label={tForm('country')}
            error={errors.address?.country?.message}
            required
            content={
              <SelectOptions
                name="address.country"
                control={control}
                options={countries}
                error={tForm('required_field')}
              />
            }
          />
          <FieldMeta
            label={tForm('region')}
            error={errors.address?.region?.message}
            content={<SelectOptions name="address.region" control={control} options={regions?.results} />}
          />
          <FieldMeta
            label={tForm('city')}
            error={errors.address?.city?.message}
            required
            content={
              <SelectOptions
                name="address.city"
                control={control}
                options={cities?.results}
                error={tForm('required_field')}
              />
            }
          />

          <FieldMeta
            label={tForm('postal_code')}
            error={errors.address?.postal_code?.message}
            required
            content={
              <Input
                {...register('address.postal_code', { required: { value: true, message: tForm('required_field') } })}
              />
            }
          />
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }}
          gap="16px"
        >
          <FieldMeta
            label={tForm('street')}
            error={errors.address?.street?.message}
            required
            content={
              <Input {...register('address.street', { required: { value: true, message: tForm('required_field') } })} />
            }
          />
          <FieldMeta
            label={tForm('street_number')}
            error={errors.address?.street_number?.message}
            content={<Input {...register('address.street_number')} />}
          />
          <FieldMeta
            label={tForm('house_number')}
            error={errors.address?.house_number?.message}
            content={<Input {...register('address.house_number')} />}
          />
          <FieldMeta
            label={tForm('apartment')}
            error={errors.address?.apartment?.message}
            content={<Input {...register('address.apartment')} />}
          />
        </Box>

        <FieldMeta
          label={tForm('comments')}
          error={errors.address?.comment?.message}
          content={<Textarea variant="outline" placeholder="Textarea" {...register('address.comment')} />}
        />
        <FieldMeta
          content={
            <Checkbox size="lg" {...register('is_default')}>
              <Text fontSize="14px">{tForm('set_as_main_address')}</Text>
            </Checkbox>
          }
        />
      </Card>

      <Stack direction="row" spacing="16px" ml="auto">
        <Button size="sm" variant="outline" bg="white" onClick={() => route.push(`/profile/addresses`)}>
          {t('cancel')}
        </Button>
        <Button size="sm" onClick={handleSubmit(onSubmit)} isLoading={isLoadingMutate}>
          {t('save')}
        </Button>
      </Stack>
    </Stack>
  )
}

export default AddressForm
