import { Box, Card, CardHeader, CardProps, Stack, StackDivider, Text } from '@chakra-ui/react'

interface SpecificationsCardProps extends CardProps {
  title: string
  specifications?: string[][]
}

const SpecificationsCard = ({ title, specifications, ...props }: SpecificationsCardProps) => {
  return (
    <Card {...props} overflow="hidden" borderRadius="8px">
      <CardHeader bgColor="light-grey.100" color="mid-grey.400" p="10px 16px">
        <Text as="h4" _firstLetter={{ textTransform: 'capitalize' }}>
          {title}
        </Text>
      </CardHeader>
      <Stack spacing="0" divider={<StackDivider borderColor="gray.200" />}>
        {specifications?.map(([key, value]) => (
          <Box key={key} p="16px" fontSize="14px" display="grid" gridTemplateColumns="1fr 1fr" gridGap="16px">
            <Text as="span" color="mid-grey.400" _firstLetter={{ textTransform: 'capitalize' }}>
              {key}
            </Text>
            <span>{value}</span>
          </Box>
        ))}
      </Stack>
    </Card>
  )
}

export default SpecificationsCard
