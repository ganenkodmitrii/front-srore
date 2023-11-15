'use client'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  HStack,
  Stack,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  ButtonGroup,
  useToast,
  CardProps,
  Badge,
} from '@chakra-ui/react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { formatAddress } from '@/src/business'
import { useTranslation } from '@/src/i18n'
import { UserIcon, PhoneIcon, MapPinIcon, EmailIcon } from '@/src/icons'
import models from '@/src/models'

const iconProps = {
  fontSize: '24px',
  style: { flexShrink: 0 },
}

export interface AddressCardProps extends CardProps {
  profileAddress: Partial<models.UserAccountAddress>
  order?: number
  hideTitle?: boolean
  hideButtons?: boolean
}

const AddressCard = ({ order, profileAddress, hideTitle = false, hideButtons = false, ...props }: AddressCardProps) => {
  const { t } = useTranslation()
  const { t: tProfileAddresses } = useTranslation('profile.addresses')
  const query = useQueryClient()
  const route = useRouter()
  const toast = useToast()

  const { mutate: deleteProfileAddressMutate } = useMutation(
    () => (profileAddress?.id ? api.userAddress.delete(profileAddress.id) : Promise.resolve()),
    {
      onSuccess: () => query.invalidateQueries(queries.userAddress.getPaginated().queryKey),
      onError: () =>
        toast({
          status: 'error',
          description: t('something_got_wrong'),
          isClosable: false,
        }),
    },
  )

  return (
    <Card p="24px" display="flex" gap="24px" {...props}>
      {!hideTitle && (
        <Stack direction="row" justify="space-between" spacing="8px">
          <Text as="h4">{`${tProfileAddresses('address')} ${order || ''}`}</Text>
          {profileAddress?.is_default && (
            <Badge as="h4" bg="primary.500" color="white" size="md">
              {tProfileAddresses('main')}
            </Badge>
          )}
        </Stack>
      )}

      <Stack spacing="16px">
        <HStack spacing="8px" className="text-14">
          <UserIcon {...iconProps} />
          <span>
            {[profileAddress?.address?.first_name, profileAddress?.address?.last_name].filter((i) => i).join(' ')}
          </span>
        </HStack>
        <HStack spacing="8px" className="text-14">
          <PhoneIcon {...iconProps} />
          <span>{profileAddress?.address?.phone}</span>
        </HStack>
        {profileAddress?.address?.email && (
          <HStack spacing="8px" className="text-14">
            <EmailIcon {...iconProps} />
            <span>{profileAddress?.address?.email}</span>
          </HStack>
        )}
        <HStack alignItems="flex-start" spacing="8px" className="text-14">
          <MapPinIcon {...iconProps} />
          <Box display="flex">{formatAddress(profileAddress.address)}</Box>
        </HStack>
      </Stack>

      {!hideButtons && (
        <Stack direction="row" spacing="8px">
          <Popover>
            {({ onClose }) => (
              <>
                <PopoverTrigger>
                  <Button w="100%" size="sm" variant="outline">
                    {t('delete')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>{t('messages.confirmation')}</PopoverHeader>
                  <PopoverBody>
                    <Stack spacing="8px">
                      <Text fontSize="sm">{t('messages.are_you_sure')}</Text>
                      <ButtonGroup display="flex" justifyContent="flex-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                          {t('cancel')}
                        </Button>
                        <Button size="sm" onClick={() => deleteProfileAddressMutate(undefined, { onSuccess: onClose })}>
                          {t('ok')}
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </>
            )}
          </Popover>
          <Button
            w="100%"
            size="sm"
            variant="outline"
            onClick={() => route.push(`/profile/addresses/edit/${profileAddress?.id}`)}
          >
            {t('edit')}
          </Button>
        </Stack>
      )}
    </Card>
  )
}

export default AddressCard
