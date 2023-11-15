import React, { useState } from 'react'

import { Radio, HStack, Box, StackProps } from '@chakra-ui/react'
import { useTheme } from '@chakra-ui/react'

import { StarIcon } from '@/src/icons'

export interface StarRatingProps extends StackProps {
  rating: number
  onRatingChange?: React.Dispatch<number>
}

const StarRating = ({ rating, onRatingChange }: StarRatingProps) => {
  const theme = useTheme()
  const red = theme.colors.red[500]

  const [hover, setHover] = useState<number>(0)

  return (
    <HStack spacing="2px">
      {[...Array(5)].map((_, index) => {
        const ratingValue: number = index + 1
        return (
          <Box
            as="label"
            key={index}
            color={ratingValue <= (hover || rating) ? 'red.500' : 'mid-grey.400'}
            onMouseEnter={() => onRatingChange && setHover(ratingValue)}
            onMouseLeave={() => onRatingChange && setHover(0)}
          >
            <Radio
              name="rating"
              display="none"
              onChange={() => onRatingChange?.(ratingValue)}
              value={String(ratingValue)}
            />
            <StarIcon
              fill={ratingValue <= (hover || rating) ? red : 'white'}
              cursor={onRatingChange && 'pointer'}
              size={20}
              transition="color 200ms"
            />
          </Box>
        )
      })}
    </HStack>
  )
}

export default StarRating
