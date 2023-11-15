import React from 'react'

import { FormControl, FormHelperText, FormLabel, FormErrorMessage, HTMLChakraProps, Text } from '@chakra-ui/react'

interface FieldMetaProps extends Omit<HTMLChakraProps<'div'>, 'content'> {
  mode?: 'dark' | 'light'
  label?: string
  error?: string
  required?: boolean
  content: React.ReactNode
  helperText?: string
}

const FieldMeta = ({ mode = 'light', label, error, content, helperText, required, ...props }: FieldMetaProps) => {
  return (
    <FormControl {...props} isInvalid={error !== undefined}>
      {label && (
        <FormLabel
          fontSize="14px"
          color={mode === 'dark' ? 'white' : 'black'}
          _firstLetter={{ textTransform: 'uppercase' }}
          mb="4px"
          display="flex"
          gap="3px"
        >
          {label} {required && <Text color="red">*</Text>}
        </FormLabel>
      )}
      {content}
      {error && <FormErrorMessage mt="4px">{error}</FormErrorMessage>}
      {helperText && (
        <FormHelperText color="primary.500" fontSize={12}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default FieldMeta
