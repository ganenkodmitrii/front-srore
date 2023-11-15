import ReactPaginate from 'react-paginate'

import { chakra } from '@chakra-ui/react'

const Pagination = chakra(ReactPaginate, {
  baseStyle: {
    display: 'flex',
    listStyle: 'none',
    flexWrap: 'wrap',
    m: 0,
    p: 0,
    gap: ['12px 4px', '8px'],

    li: {
      a: {
        w: ['22px', '24px', '32px'],
        h: ['22px', '24px', '32px'],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'mid-grey.400',
        fontSize: ['12px', '14px'],
        borderRadius: { base: '4px', lg: 'full' },
        transition: '.2s',
        cursor: 'pointer',
      },
      '&:hover a': {
        bgColor: 'light-grey.300',
        border: '1px solid light-grey.400',
      },
      '&:where(:not(.previous):not(.next):not(.break):not(.selected)) a': {
        bgColor: 'white',
      },
      '&.selected a': {
        color: 'white',
        bgColor: 'primary.500',
      },
      '&.disabled a': {
        display: 'none',
      },
    },
  },
})

export default Pagination
