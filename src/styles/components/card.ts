import { defineStyleConfig } from '@chakra-ui/react'

const Card = defineStyleConfig({
  baseStyle: {
    container: {
      boxShadow: 'none',
    },
  },

  variants: {
    thumbnail: {
      container: {
        cursor: 'pointer',
        p: '3px',
        aspectRatio: '1',
        borderRadius: '8px',
        bg: 'light-grey.400',
      },
    },
    'thumbnail-light': {
      container: {
        p: '3px',
        aspectRatio: '1',
        borderRadius: '4px',
        bg: 'light-grey.100',
      },
    },
  },
})

export default Card
