import { CSSProperties } from 'react'

import { Input, InputGroup, InputRightElement, useBoolean, InputProps } from '@chakra-ui/react'

import { EyeIcon, EyeOffIcon } from '@/src/icons'

interface PasswordInputProps extends InputProps {
  groupWidth?: CSSProperties['width']
}

const PasswordInput: React.FC<PasswordInputProps> = ({ groupWidth, ...props }) => {
  const [isHidden, setIsHidden] = useBoolean(true)
  return (
    <InputGroup w={groupWidth}>
      <Input type={isHidden ? 'password' : 'text'} {...props} />
      <InputRightElement onClick={setIsHidden.toggle} fontSize={24} h="full">
        {isHidden ? <EyeIcon /> : <EyeOffIcon />}
      </InputRightElement>
    </InputGroup>
  )
}

export default PasswordInput
