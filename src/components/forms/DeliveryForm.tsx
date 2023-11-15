import { useState, useEffect } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, Control } from 'react-hook-form'

import { Text, Box, Stack, Grid, Card, Link, Input, Textarea } from '@chakra-ui/react'

import { useQueries, useQuery } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { defaultSelectPagination } from '@/src/business'
import { FieldMeta, SelectOptions, SelectableAddressCard } from '@/src/components'
import { useAuth } from '@/src/contexts'
import { useTranslation } from '@/src/i18n'
import { PlusIcon } from '@/src/icons'
import models from '@/src/models'

export interface DeliveryFormProps {
  register: UseFormRegister<models.CartFormValues>
  errors: FieldErrors<models.CartFormValues>
  setValue: UseFormSetValue<models.CartFormValues>
  watch: UseFormWatch<models.CartFormValues>
  control: Control<models.CartFormValues, any>
}

const DeliveryForm = ({ register, errors, setValue, watch, control }: DeliveryFormProps) => {
  const { t } = useTranslation('forms')
  const { t: tProfileAddresses } = useTranslation('profile.addresses')
  const { user, isAuth } = useAuth()

  const { data } = useQuery({
    ...queries.userAddress.getPaginated(),
    enabled: !!isAuth,
    select: (data) => data.results,
  })

  const country = watch('new_address.country')
  const region = watch('new_address.region')

  const [{ data: countries }, { data: regions }, { data: cities }] = useQueries({
    queries: [
      { ...queries.addresses.getAllCountries() },
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

  const [cardIndex, setCardIndex] = useState(data?.find((item) => item.is_default === true)?.address.id)
  useEffect(() => setValue('address', cardIndex), [cardIndex, setValue])

  const requiredProps = { required: { value: true, message: t('required_field') } }

  return (
    <Box>
      {user ? (
        <Grid gridAutoRows="1fr" templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="16px">
          {data?.map((item, index) => {
            return (
              <SelectableAddressCard
                key={index}
                hideTitle
                hideButtons
                profileAddress={item}
                href={`/profile/addresses/edit/${item.id}`}
                selected={cardIndex === +item.address.id}
                onClick={() => {
                  setValue('address', +item.address.id)
                  setCardIndex(+item.address.id)
                }}
              />
            )
          })}

          <Card
            as={Link}
            href="/profile/addresses/add"
            _hover={{ textDecoration: 'none' }}
            p="24px"
            display="grid"
            placeItems="center"
            border="1px solid"
            borderColor="light-grey.400"
          >
            <Stack align="center" spacing="8px">
              <Box color="white" bg="primary.500" p="12px" borderRadius="8px">
                <PlusIcon fontSize="32px" />
              </Box>
              <Text as="h4">{tProfileAddresses('add_new_address')}</Text>
            </Stack>
          </Card>
        </Grid>
      ) : (
        <Stack gap="16px">
          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap="16px"
          >
            <FieldMeta
              label={t('country')}
              error={errors.new_address?.country?.message}
              required
              content={
                <SelectOptions
                  name="new_address.country"
                  control={control}
                  options={countries}
                  error={t('required_field')}
                />
              }
            />
            <FieldMeta
              label={t('region')}
              error={errors.new_address?.region?.message}
              content={<SelectOptions name="new_address.region" control={control} options={regions?.results} />}
            />
            <FieldMeta
              label={t('city')}
              error={errors.new_address?.city?.message}
              required
              content={
                <SelectOptions
                  name="new_address.city"
                  control={control}
                  options={cities?.results}
                  error={t('required_field')}
                />
              }
            />
          </Box>

          <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="16px">
            <FieldMeta
              label={t('postal_code')}
              error={errors.new_address?.postal_code?.message}
              required
              content={
                <Input
                  {...register('new_address.postal_code', { required: { value: true, message: t('required_field') } })}
                />
              }
            />
            <FieldMeta
              label={t('street')}
              error={errors.new_address?.street?.message}
              required
              content={<Input {...register('new_address.street', requiredProps)} />}
            />
            <FieldMeta
              label={t('street_number')}
              error={errors.new_address?.street_number?.message}
              content={<Input {...register('new_address.street_number')} />}
            />
          </Box>

          <FieldMeta
            label={t('comments')}
            error={errors.new_address?.comment?.message}
            content={<Textarea variant="outline" placeholder="Textarea" {...register('new_address.comment')} />}
          />
        </Stack>
      )}
    </Box>
  )
}

export default DeliveryForm
