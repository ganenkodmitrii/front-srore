import { useNumberInput, HStack, Input, chakra, StackProps, Box } from '@chakra-ui/react'

import { MinusIcon, PlusIcon } from '@/src/icons'

const iconProps = {
  color: 'mid-grey.100',
  fontSize: '24px',
  transition: 'color 0.2s ease-in-out',
  flexShrink: 0,
  _hover: { color: 'mid-grey.500' },
}

const IconBox = chakra(Box, { baseStyle: iconProps })

const variants = {
  sm: { p: '0', borderRadius: '4px', spacing: '0' },
  md: { p: '0 8px', borderRadius: '6px' },
}

interface NumberInputProps extends Omit<StackProps, 'onChange'> {
  size?: 'sm' | 'md'
  step?: number
  defaultValue?: number
  min?: number
  max?: number

  value?: number
  onChange?: (valueAsString: string, valueAsNumber: number) => void
}

const CustomizedNumberInput = ({
  size = 'md',
  step = 1,
  defaultValue = 1,
  min = 1,
  max = 10,
  value,
  onChange,
  ...props
}: NumberInputProps) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step,
    defaultValue,
    min,
    max,

    value,
    onChange,
  })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <HStack {...props} borderColor="light-grey.400" borderWidth="1px" {...variants[size]}>
      <IconBox {...dec}>
        <MinusIcon />
      </IconBox>
      <Input size="sm" border="0" minW="20px" h="24px" bg="transparent" p="0" {...input} />
      <IconBox {...inc}>
        <PlusIcon />
      </IconBox>
    </HStack>
  )
}

export default CustomizedNumberInput
