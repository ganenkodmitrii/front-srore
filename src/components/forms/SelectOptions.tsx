import { useEffect, useRef, useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { FixedSizeList } from 'react-window'

import {
  Box,
  Button,
  CheckboxIcon,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useTheme,
} from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'
import { ChevronDownIcon } from '@/src/icons'

export interface OptionType {
  name: string
  id: number
}

interface SelectOptionsProps {
  options?: OptionType[]
  control: Control<any>
  name: string
  error?: string
}

const itemHeight = 40
const maxItemsInView = 5

const SelectOptions = ({ options, control, name, error }: SelectOptionsProps) => {
  const theme = useTheme()
  const ref = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const [width, setWidth] = useState<number>(0)
  const [searchInput, setSearchInput] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<number>(0)
  const optionsFiltered = options?.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))
  const optionsLength = optionsFiltered?.length || 0
  const height = (optionsLength > maxItemsInView ? maxItemsInView : optionsLength) * itemHeight

  useEffect(() => {
    setWidth(ref.current?.getBoundingClientRect().width ?? 200)
  }, [])

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: error && { value: true, message: error } }}
      render={({ field }) => (
        <Menu>
          {({ isOpen }) => {
            if (isOpen) inputRef.current?.focus()
            return (
              <>
                <MenuButton
                  ref={ref}
                  w="100%"
                  variant="outline"
                  size="sm"
                  bg="white"
                  as={Button}
                  textAlign="left"
                  borderColor={control.getFieldState(name)?.invalid ? 'red.500' : 'light-grey.400'}
                  rightIcon={
                    <ChevronDownIcon
                      fontSize="20px"
                      strokeWidth="2px"
                      color={
                        control.getFieldState(name)?.invalid ? theme.colors.red[500] : theme.colors['mid-grey'][400]
                      }
                    />
                  }
                >
                  {options?.find((item) => item.id === selectedOption)?.name || t('select_an_option')}
                </MenuButton>

                <MenuList p="0" overflow="hidden" mt="41px" borderTopRadius="0">
                  {!optionsFiltered?.length && (
                    <MenuItem p="4px 12px" bg="white" cursor="default">
                      {t('no_options')}
                    </MenuItem>
                  )}

                  <Box
                    pos="fixed"
                    top="0"
                    left="0"
                    w="100%"
                    bg="white"
                    p="4px 12px"
                    border="1px solid"
                    borderColor="gray.200"
                    borderTopRadius="6px"
                  >
                    <Input
                      ref={inputRef}
                      size="sm"
                      variant="outline"
                      placeholder={t('search')}
                      _focusVisible={{}}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onBlur={(e) => e.currentTarget.focus()}
                    />
                  </Box>

                  <FixedSizeList
                    width={width}
                    height={height}
                    itemSize={itemHeight}
                    itemCount={optionsFiltered?.length || 0}
                  >
                    {({ index, style }): any => (
                      <MenuItem
                        style={style}
                        key={optionsFiltered?.[index].id}
                        p="4px 12px"
                        bg={selectedOption === optionsFiltered?.[index].id ? 'teal.100' : undefined}
                        _hover={{ bg: 'teal.100' }}
                        onClick={() => {
                          field.onChange(optionsFiltered?.[index].id)
                          setSelectedOption(optionsFiltered?.[index].id ?? 0)
                          setSearchInput('')
                        }}
                      >
                        <Flex align="center" gap="8px">
                          {optionsFiltered?.[index].name}
                          {selectedOption === optionsFiltered?.[index].id && <CheckboxIcon fontSize="18px" />}
                        </Flex>
                      </MenuItem>
                    )}
                  </FixedSizeList>
                </MenuList>
              </>
            )
          }}
        </Menu>
      )}
    />
  )
}

export default SelectOptions
