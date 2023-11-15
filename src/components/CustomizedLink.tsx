import { PropsWithChildren } from 'react'

import NextLink from 'next/link'

import { LinkProps, chakra } from '@chakra-ui/react'

interface ChakraLinkProps extends PropsWithChildren<LinkProps> {
  color?: string
  underlineOnHover?: boolean
}
const CustomLink = chakra(NextLink, {
  baseStyle: {
    transition: 'color 0.2s ease-in-out',
    _hover: { color: 'primary.500' },
  },
})

const CustomizedLink = ({ children, color, underlineOnHover, ...props }: ChakraLinkProps) => {
  return (
    <CustomLink
      color={color}
      _hover={{ textDecoration: underlineOnHover ? 'underline' : 'none', color: 'primary.500' }}
      {...props}
    >
      {children}
    </CustomLink>
  )
}

export default CustomizedLink
