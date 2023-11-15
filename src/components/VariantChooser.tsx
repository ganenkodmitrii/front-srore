import { useState } from 'react'

import Image from 'next/image'

import { StackProps, Stack, Button, Text, Box } from '@chakra-ui/react'

import { getNameAndValues } from '@/src/business'
import models from '@/src/models'
import { capitalize } from '@/src/utils'

interface ChooserProps extends StackProps {
  selected: string
  choose: {
    title: string
    values: { name: string; image: string }[]
  }
  onChoose?: ({ title, value }: { title: string; value: string }) => void
}

const Chooser = ({ selected, choose, onChoose, ...props }: ChooserProps) => {
  const [value, setValue] = useState(selected)
  const hasImages = choose.values.every((v) => Boolean(v.image)) && choose.values.length > 1

  return (
    <Stack {...props} spacing="16px">
      <p className="text-14">
        <Text as="span" color="mid-grey.400">
          {choose.title}:{' '}
        </Text>
        <Text as="span" color="black">
          {capitalize(value)}
        </Text>
      </p>
      <Stack direction="row" wrap="wrap" spacing={hasImages ? '16px' : '8px'}>
        {choose.values.map((v) => (
          <>
            {hasImages ? (
              <Box
                key={v.name}
                w="80px"
                h="80px"
                p="3px"
                borderRadius="4px"
                border={value === v.name ? '1px solid' : 'none'}
                borderColor={value === v.name ? 'primary.500' : 'none'}
                backgroundColor="light-grey.100"
                cursor="pointer"
                onClick={() => {
                  setValue(v.name)
                  onChoose?.({ title: choose.title, value: v.name })
                }}
              >
                <Box position="relative" w="full" h="full">
                  <Image src={v.image} alt={v.name} fill objectFit="cover" style={{ borderRadius: '4px' }} />
                </Box>
              </Box>
            ) : (
              <Button
                key={v.name}
                size="sm"
                className="text-14"
                borderRadius="full"
                variant={value === v.name ? 'solid' : 'outline'}
                onClick={() => {
                  setValue(v.name)
                  onChoose?.({ title: choose.title, value: v.name })
                }}
              >
                {choose.title}: {capitalize(v.name)}
              </Button>
            )}
          </>
        ))}
      </Stack>
    </Stack>
  )
}

interface VariantChooserProps extends StackProps {
  product?: models.Product
  onVariantChange?: (id?: number) => void
}

const VariantChooser = ({ product, onVariantChange, ...props }: VariantChooserProps) => {
  const variants = product?.parent?.variants
  const nameOfAttributes = product?.attributes.filter((a) => a.is_different).map((a) => a.attribute.name) || []
  const nameAndValues = getNameAndValues(nameOfAttributes, variants)
  const selected = product?.attributes.filter((a) => a.is_different).map((a) => a.value) || []

  return (
    <Stack {...props} spacing="24px">
      {nameAndValues.map((v, index) => (
        <Chooser
          key={v.name}
          selected={selected[index]}
          choose={{ title: v.name, values: v.values }}
          onChoose={(value) => {
            const id = variants?.find(
              (v) => v.attributes.find((a) => a.attribute.name === value.title)?.value === value.value,
            )?.id
            onVariantChange?.(id)
          }}
        />
      ))}
    </Stack>
  )
}

export default VariantChooser
