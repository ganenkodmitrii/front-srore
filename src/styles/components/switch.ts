import { defineStyleConfig } from '@chakra-ui/react'

const Switch = defineStyleConfig({
  baseStyle: {
    track: {
      background: 'mid-grey.100',
      _hover: {
        background: 'mid-grey.200',
      },
      _active: {
        background: 'mid-grey.300',
      },
      _checked: {
        background: 'primary.500',
        _hover: {
          background: 'primary.600',
          _disabled: {
            background: 'primary.700',
          },
        },
        _active: {
          background: '#1A813E',
        },
        _disabled: {
          background: '#B0BABF',
        },
      },
    },
  },
})

export default Switch
