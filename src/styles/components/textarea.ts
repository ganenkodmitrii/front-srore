import { defineStyleConfig } from '@chakra-ui/react'

const Textarea = defineStyleConfig({
  baseStyle: {
    color: '#000',
    _placeholder: {
      fontSize: 14,
    },
    _invalid: {
      border: '1px solid #F76659',
    },
  },
  variants: {
    base: {
      bg: '#fff',
      fontSize: 14,
    },
    error: {
      bg: '#fff',
      fontSize: 14,
      border: '1px solid #f76659',
    },
  },

  defaultProps: {
    variant: 'base',
  },
})

export default Textarea
