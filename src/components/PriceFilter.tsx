import React, { useMemo } from 'react'

import {
  Flex,
  Input,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  useControllableState,
  Box,
} from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'

interface PriceFilterProps {
  initialPriceMin?: number
  initialPriceMax?: number
  onPriceMinChange?: React.Dispatch<number | undefined>
  onPriceMaxChange?: React.Dispatch<number | undefined>
  priceLimit?: number
}

const DEFAULT_PRICE_LIMIT = 100_000

const PriceFilter = ({
  initialPriceMin,
  initialPriceMax,
  onPriceMinChange,
  onPriceMaxChange,
  priceLimit = DEFAULT_PRICE_LIMIT,
}: PriceFilterProps) => {
  const { t } = useTranslation()

  const [priceMin, setPriceMin] = useControllableState<number | undefined>({
    defaultValue: initialPriceMin,
    onChange: onPriceMinChange,
  })
  const [priceMax, setPriceMax] = useControllableState<number | undefined>({
    defaultValue: initialPriceMax,
    onChange: onPriceMaxChange,
  })

  const handlePriceMinChange = (value: string | number) => {
    if (!value) {
      setPriceMin(undefined)
      return
    }
    value = Number(value)

    let newPriceMin: number | undefined = Math.max(0, Math.min(value, priceLimit))
    newPriceMin = Math.round(newPriceMin)

    if (newPriceMin > (priceMax || priceLimit)) {
      setPriceMax(undefined)
    }
    if (newPriceMin === 0) newPriceMin = undefined // Remove value from input if its 0

    setPriceMin(newPriceMin)
  }

  const handlePriceMaxChange = (value: string | number) => {
    if (!value) {
      setPriceMax(undefined)
      return
    }
    value = Number(value)

    let newPriceMax: number | undefined = Math.min(priceLimit, Math.max(value, 0))
    newPriceMax = Math.round(newPriceMax)

    if (newPriceMax < (priceMin || 0)) {
      setPriceMin(undefined)
    }
    if (newPriceMax === priceLimit) newPriceMax = undefined // Remove value from input if its 0

    setPriceMax(newPriceMax)
  }

  const handleRangeChange = (value: number[]) => {
    handlePriceMinChange(((value[0] || 0) / 100) * priceLimit)
    handlePriceMaxChange(((value[1] || 0) / 100) * priceLimit)
  }

  const rangeValue = useMemo(
    () => [((priceMin || 0) / priceLimit) * 100, ((priceMax || priceLimit) / priceLimit) * 100],
    [priceMin, priceLimit, priceMax],
  )

  return (
    <>
      <Flex mb="8px" gap="8px" lineHeight="24px">
        <Input
          size="xs"
          flex={1}
          placeholder={t('min')}
          value={priceMin || ''}
          type="number"
          onChange={(event) => handlePriceMinChange(event.target.value)}
        />
        <Input
          size="xs"
          flex={1}
          placeholder={t('max')}
          value={priceMax || ''}
          type="number"
          onChange={(event) => handlePriceMaxChange(event.target.value)}
        />
      </Flex>
      <Box textAlign="center">
        <RangeSlider
          colorScheme="primary"
          value={rangeValue}
          onChange={handleRangeChange}
          width="calc(100% - 16px)"
          margin="0 auto"
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </Box>
    </>
  )
}

export default PriceFilter
