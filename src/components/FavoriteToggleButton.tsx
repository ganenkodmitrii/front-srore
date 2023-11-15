import { IconButton, chakra } from '@chakra-ui/react'

import { motion } from 'framer-motion'

import { HeartIcon } from '@/src/icons'

const ChakraHeartIcon = chakra(HeartIcon)

const variants = {
  outline: {
    variant: 'outline',
    bg: 'white',
    color: 'primary.500',
  },
  text: {
    variant: 'text',
    bg: 'transparent',
  },
}

interface FavoriteToggleButtonProps {
  variant?: 'outline' | 'text'
  iconSize?: string
  favorite?: boolean
  onToggle: () => void
}

const FavoriteToggleButton = ({
  variant = 'outline',
  iconSize = '24px',
  favorite,
  onToggle,
}: FavoriteToggleButtonProps) => {
  return (
    <IconButton rounded="full" aria-label="" size="sm" {...variants[variant]}>
      <motion.div
        animate={favorite ? 'checked' : undefined}
        variants={{
          checked: { rotate: 360 },
        }}
      >
        <ChakraHeartIcon
          fill={favorite ? 'primary.500' : undefined}
          color={favorite ? 'transparent' : undefined}
          fontSize={iconSize}
          onClick={onToggle}
        />
      </motion.div>
    </IconButton>
  )
}

export default FavoriteToggleButton
