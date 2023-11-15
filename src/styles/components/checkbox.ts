import { defineStyleConfig } from '@chakra-ui/react'

const Checkbox = defineStyleConfig({
  baseStyle: {
    control: {
      borderRadius: '4px',
      border: '1px solid #B0BABF',
      backgroundColor: '#f6f8f9',
      _hover: {
        border: '1px solid #9aa6ac',
        backgroundColor: '#eef0f2',
      },
      _active: {
        border: '1px solid #84919A',
        backgroundColor: '#E5E9EB',
      },
      _checked: {
        backgroundColor: 'primary.500',
        border: '1px solid #35B449',
        _hover: {
          border: '1px solid #269A43',
          backgroundColor: 'primary.600',
        },
        _active: {
          border: '1px solid primary.700',
          backgroundColor: '#1A813E',
        },
      },
    },
  },
})

export default Checkbox
