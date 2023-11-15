import Image from 'next/image'

import { Box, Text } from '@chakra-ui/react'

interface MemberCardProps {
  image?: string
  name: string
  jobPosition: string
}

const MemberCard = ({ image, name, jobPosition }: MemberCardProps) => {
  return (
    <Box w="320px">
      {image && (
        <Box h="400px" position="relative">
          <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} />
        </Box>
      )}
      <Text color="dark-grey.400" fontSize="24px" fontWeight="600">
        {name}
      </Text>
      <Text color="primary.500" fontSize="18px">
        {jobPosition}
      </Text>
    </Box>
  )
}

export default MemberCard
