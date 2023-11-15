import Link from 'next/link'

import { HStack, Radio, Box } from '@chakra-ui/react'

import { PencilIcon } from '@/src/icons'

import AddressCard, { AddressCardProps } from './AddressCard'

const variants = {
  default: {
    cursor: 'pointer',
    border: '1px solid',
    borderColor: 'light-grey.400',
    transition: 'border-color 0.2s ease-in-out',
    _hover: {
      borderColor: 'primary.300',
    },
    _active: {
      borderColor: 'primary.700',
    },
  },
  selected: {
    border: '1px solid',
    borderColor: 'primary.500',
  },
}

interface SelectableAddressCardProps extends AddressCardProps {
  href: string
  selected?: boolean
}

const SelectableAddressCard = ({ selected, href, ...props }: SelectableAddressCardProps) => {
  return (
    <Box pos="relative">
      <HStack position="absolute" zIndex="1" top="16px" right="16px" spacing="16px">
        <Link href={href}>
          <PencilIcon fontSize="24px" />
        </Link>

        <Radio colorScheme="primary" isChecked={selected} />
      </HStack>

      <AddressCard {...(selected ? variants.selected : variants.default)} {...props} />
    </Box>
  )
}

export default SelectableAddressCard
