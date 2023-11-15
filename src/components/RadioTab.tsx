import { TabProps, Tab, Radio, Box, Stack } from '@chakra-ui/react'

interface RadioTabProps extends TabProps {
  isActive: boolean
}

const RadioTab = ({ isActive, children, ...props }: RadioTabProps) => {
  return (
    <Tab
      p="16px"
      borderRadius="8px"
      border="1px solid"
      borderColor="light-grey.400"
      color="mid-grey.400"
      transition="border-color 0.2s ease-in-out"
      _hover={{ borderColor: 'primary.300' }}
      _selected={{ borderColor: 'primary.500' }}
      _active={{ borderColor: 'primary.700' }}
      {...props}
    >
      <Stack
        direction={{
          base: 'column',
          sm: 'row',
        }}
        alignItems="flex-start"
        w="100%"
        spacing="8px"
        mb="auto"
      >
        <Radio mt="4px" isChecked={isActive} />
        <Box w="100%" textAlign="left" className="text-14">
          {children}
        </Box>
      </Stack>
    </Tab>
  )
}

export default RadioTab
