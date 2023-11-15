import Image from 'next/image'

import { VStack, Text, Box } from '@chakra-ui/react'

interface ValueCardProps {
  icon: string
  title: string
  description: string
}

const ValueCard = ({ icon, title, description }: ValueCardProps) => {
  return (
    <VStack
      gap="20px"
      p="24px 16px"
      bg="transparent"
      borderRadius="8px"
      textAlign="center"
      _hover={{ bg: 'white' }}
      transition="all 0.3s ease"
      maxW="440px"
      cursor="pointer"
    >
      <Box
        w="44px"
        h="44px"
        bg="#F8FFF6"
        borderRadius="24px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image src={icon} alt={title} width={24} height={24} />
      </Box>
      <VStack gap="8px">
        <Text fontSize="20px" fontWeight="500" color="dark-grey.400">
          {title}
        </Text>
        <Text color="mid-grey.400">{description}</Text>
      </VStack>
    </VStack>
  )
}

export default ValueCard
