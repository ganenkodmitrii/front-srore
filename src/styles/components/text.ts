import { defineStyleConfig } from '@chakra-ui/react'

const Text = defineStyleConfig({
  variants: {
    'capitalize-first': {
      _firstLetter: {
        textTransform: 'capitalize',
      },
    },
    ellipsis: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
})

export default Text
