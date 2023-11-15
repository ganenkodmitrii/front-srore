import { defineStyleConfig } from '@chakra-ui/react'

const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 600,
  },
  variants: {
    solid: {
      backgroundColor: 'primary.500',
      color: 'white',
      fontSize: 14,
      _hover: {
        backgroundColor: 'primary.600',
        _disabled: {
          backgroundColor: 'primary.500',
        },
      },
      _active: {
        backgroundColor: 'primary.700',
      },
      _focus: {
        border: '3px solid primary.300',
        outline: 'none',
      },
    },
    outline: {
      fontWeight: 400,
      fontSize: 14,
      color: 'dark-grey.400',
      _hover: {
        background: 'light-grey.100',
      },
      _active: {
        background: 'light-grey.300',
      },
      _focus: {
        border: '3px solid primary.300',
      },
    },
    text: {
      fontWeight: 400,
      fontSize: 14,
      border: 'none',
      _hover: {
        background: 'light-grey.200',
      },
      _active: {
        background: 'light-grey.300',
      },
      _focus: {
        border: '3px solid primary.300',
      },
    },

    white: {
      fontWeight: 400,
      fontSize: 14,
      bg: 'white',
      border: '1px solid',
      borderColor: 'light-grey.400',
      _hover: {
        background: 'light-grey.100',
      },
      _active: {
        background: 'light-grey.300',
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },

    icon: {
      bg: 'transparent',
      fontSize: 32,
      border: 'none',
      p: '0px',
      transition: 'all 0.2s ease-in-out',
      _hover: {
        bg: 'transparent',
        color: 'primary.500',
      },
    },

    delete: {
      bg: 'red.500',
      color: 'red.100',
      transition: 'all 0.2s ease-in-out',
      _hover: {
        bg: 'red.600',
      },
    },
  },
})

export default Button
