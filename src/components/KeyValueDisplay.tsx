import { Flex, FlexProps, Stack, Text } from '@chakra-ui/react'

interface KeyValueDisplayProps extends FlexProps {
  object: Record<string, string | undefined>
  translationFn?: (key: string) => string
}

export const KeyValueDisplay = ({ object, translationFn, ...props }: KeyValueDisplayProps) => {
  return (
    <Flex gap="16px" wrap="wrap" justifyContent="space-between" {...props}>
      {Object.entries(object).map(([key, value]) => (
        <Stack key={key} justify="space-between" fontSize="14px" spacing="0">
          <Text color="mid-grey.400">{translationFn ? translationFn(key) : key}</Text>
          <Text>{value ?? '-'}</Text>
        </Stack>
      ))}
    </Flex>
  )
}

export default KeyValueDisplay
