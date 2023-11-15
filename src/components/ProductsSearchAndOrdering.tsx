import { useMemo, useState } from 'react'

import {
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Text,
  chakra,
} from '@chakra-ui/react'

import { useUpdateEffect } from '@react-hookz/web'

import { ProductsFiltersState } from '@/src/business'
import { useTranslation } from '@/src/i18n'
import { CheckboxIcon, ChevronDownIcon, SearchIcon } from '@/src/icons'

interface ProductsSearchAndOrderingProps {
  initialFiltersValue?: ProductsFiltersState
  onFiltersChange?: React.Dispatch<React.SetStateAction<ProductsFiltersState>>
}

const ChakraSearchIcon = chakra(SearchIcon, {
  baseStyle: {
    color: 'mid-grey.100',
  },
})
const ChakraChevronDownIcon = chakra(ChevronDownIcon, {
  baseStyle: {
    color: 'mid-grey.100',
  },
})

const ChakraCheckboxIcon = chakra(CheckboxIcon)

const ProductsSearchAndOrdering = ({ initialFiltersValue, onFiltersChange }: ProductsSearchAndOrderingProps) => {
  const { t } = useTranslation()

  const [ordering, setOrdering] = useState<string | undefined>(initialFiltersValue?.ordering)

  useUpdateEffect(() => {
    // reset page to 1 when filters change
    onFiltersChange?.((prev) => ({ ...prev, page: 1, ordering }))
  }, [ordering, onFiltersChange])

  const handleSearchChange = (value: string) => onFiltersChange?.((prev) => ({ ...prev, page: 1, search: value }))

  const orderingMenuItems = useMemo(
    () => [
      {
        label: t('sort_options.name'),
        value: 'name',
      },
      {
        label: t('sort_options.name_reverse'),
        value: '-name',
      },
      {
        label: t('sort_options.price'),
        value: 'prices',
      },
      {
        label: t('sort_options.price_reverse'),
        value: '-prices',
      },
      {
        label: t('sort_options.discount_reverse'),
        value: 'discounted_price',
      },
      {
        label: t('sort_options.discount'),
        value: '-discounted_price',
      },
    ],
    [t],
  )

  const handleOrderingChange = (value: string) => setOrdering(ordering === value ? undefined : value)

  const selectedItem = useMemo(
    () => orderingMenuItems.find(({ value }) => value === ordering),
    [ordering, orderingMenuItems],
  )

  return (
    <>
      <Flex wrap="wrap" gap="12px 32px" justify={{ base: 'end', md: 'space-between' }}>
        <InputGroup
          maxW={{
            base: '100%',
            md: '260px',
            xl: '440px',
          }}
        >
          <Input
            defaultValue={initialFiltersValue?.search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search"
          />
          <InputRightElement>
            <ChakraSearchIcon fontSize="18px" />
          </InputRightElement>
        </InputGroup>
        <Flex align="center" gap="8px">
          <Text>{t('sort_by')}</Text>
          <Menu placement="bottom-end">
            <MenuButton
              variant="outline"
              size="sm"
              bg="white"
              as={Button}
              rightIcon={<ChakraChevronDownIcon fontSize="24px" />}
            >
              {selectedItem?.label || t('implicit')}
            </MenuButton>
            <MenuList>
              {orderingMenuItems.map((item) => (
                <MenuItem
                  key={item.value}
                  rounded="4px"
                  bg={ordering === item.value ? 'teal.100' : undefined}
                  onClick={() => handleOrderingChange(item.value)}
                >
                  <Flex align="center" gap="8px">
                    {item.label}
                    {ordering === item.value ? <ChakraCheckboxIcon fontSize="18px" /> : undefined}
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </>
  )
}

export default ProductsSearchAndOrdering
