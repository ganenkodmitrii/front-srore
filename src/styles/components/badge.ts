import { defineStyleConfig } from '@chakra-ui/react'

const Badge = defineStyleConfig({
  baseStyle: {
    textTransform: 'capitalize',
    borderRadius: '6px',
    fontWeight: 600,
  },
  sizes: {
    md: {
      height: '24px',
      py: '1px',
      px: '8px',
      fontSize: '14px',
    },
    sm: {
      fontSize: 12,
      px: '4px',
    },
    lg: {
      fontSize: 14,
      px: '12px',
      py: '4px',
    },
  },
  variants: {
    red: {
      backgroundColor: 'red.600',
      color: 'red.100',
    },
    green: {
      backgroundColor: 'primary.500',
      color: 'primary.100',
    },
    lightgreen: {
      backgroundColor: 'green.500',
      color: 'green.100',
    },
    yellow: {
      backgroundColor: 'yellow.500',
      color: 'yellow.800',
    },
    purple: {
      backgroundColor: 'purple.500',
      color: 'purple.100',
    },
    aqua: {
      backgroundColor: 'teal.500',
      color: 'teal.100',
    },
    grey: {
      backgroundColor: 'dark-grey.100',
      color: 'light-grey.100',
    },

    outlined: {
      backgroundColor: 'transparent',
      color: 'dark-grey.400',
      border: '1px solid',
      borderRadius: '10px',
      fontWeight: 400,
      borderColor: 'light-grey.400',
    },
  },
})

export default Badge
