import { defineStyleConfig } from '@chakra-ui/react'

const Radio = defineStyleConfig({
  defaultProps: {
    colorScheme: 'primary',
  },
  baseStyle: {
    control: {
      h: '16px',
      w: '16px',
      colorScheme: 'primary',
      bg: 'light-grey.100',
      border: '1px solid',
      borderColor: 'mid-grey.100',

      _checked: {
        border: '2px solid',
        borderColor: 'primary.500 !important',
      },
    },
  },
})

export default Radio
