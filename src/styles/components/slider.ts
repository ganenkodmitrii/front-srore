import { defineStyleConfig } from '@chakra-ui/react'

const Slider = defineStyleConfig({
  baseStyle: {
    thumb: {
      width: '16px',
      height: '16px',
      border: '5px solid',
      borderColor: 'primary.500',
    },
  },
})

export default Slider
