'use client'

import { Button, Stack } from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'

export interface Props {
  tabs: string[]
  selected?: string
  onSelect: (mark: string) => void
}

const BadgeTabList = ({ tabs, selected, onSelect }: Props) => {
  const { t } = useTranslation('filter_tabs')
  return (
    <Stack direction={['column', 'row']} wrap="wrap">
      {tabs?.map((tab) => (
        <Button
          onClick={() => onSelect(tab)}
          fontWeight="bold"
          borderColor="light-grey.400"
          key={tab}
          variant={selected === tab ? 'solid' : 'outline'}
          rounded="full"
        >
          {t(tab)}
        </Button>
      ))}
    </Stack>
  )
}

export default BadgeTabList
