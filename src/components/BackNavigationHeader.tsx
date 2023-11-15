import Link from 'next/link'

import { Flex, FlexProps, Text } from '@chakra-ui/react'

import { PencilIcon } from '@/src/icons'

interface BackNavigationHeaderProps extends FlexProps {
  title: string
  href: string
}

const BackNavigationHeader = ({ title, href, ...props }: BackNavigationHeaderProps) => {
  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      <Text as="h4">{title}</Text>

      <Link href={href}>
        <PencilIcon fontSize="24px" />
      </Link>
    </Flex>
  )
}

export default BackNavigationHeader
