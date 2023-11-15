import { defineStyleConfig } from '@chakra-ui/react'

const Input = defineStyleConfig({
  baseStyle: {
    field: {
      paddingInlineEnd: '0px',
      paddingInlineStart: '0px',
      padding: '4px 12px',
      color: 'dark-grey.400',
      border: '1px solid',
      borderColor: 'light-grey.400',
      borderRadius: '6px',
      _placeholder: {
        fontSize: 14,
        color: 'mid-grey.200',
      },
      _invalid: {
        border: '1px solid #F76659',
      },
    },
  },

  sizes: {
    xs: {
      field: {
        padding: '0px 8px',
        borderRadius: '4px',
      },
    },
    sm: {
      field: {
        padding: '4px 12px',
        borderRadius: '6px',
      },
    },
  },
  variants: {
    base: {
      field: {
        bg: '#fff',
        fontSize: '14px',
        border: '1px solid #DDE2E4',
        borderRadius: '6px',
      },
    },
    error: {
      field: {
        bg: '#fff',
        fontSize: '14px',
        border: '1px solid #f76659',
      },
    },
  },

  defaultProps: {
    size: 'sm',
    variant: 'base',
  },
})

export default Input
