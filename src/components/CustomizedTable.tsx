'use client'

import { Table, Thead, Tbody, Tr, Th, Td, Text, TableProps } from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'

interface Column {
  title?: string
  dataIndex: string
  render?: (value: any, row: any, index: number) => JSX.Element
  width?: number
}

interface CustomizedTableProps extends TableProps {
  columns: Column[]
  data: any[]
}

const CustomizedTable = ({ columns, data, ...props }: CustomizedTableProps) => {
  const { t } = useTranslation()

  return (
    <Table size="sm" bg="white" borderRadius="8px" overflow="hidden" {...props}>
      <Thead bg="light-grey.100">
        <Tr>
          {columns?.map?.((column, index) => (
            <Th
              key={index}
              w={column.width ?? 'auto'}
              p="10px 16px"
              textTransform="lowercase"
              fontWeight="400"
              fontSize="14px"
              color="mid-grey.400"
              _firstLetter={{ textTransform: 'uppercase' }}
            >
              {column.title}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data?.map?.((row, rowIndex) => (
          <Tr key={rowIndex}>
            {columns?.map?.((column, colIndex) => (
              <Td key={colIndex} p="16px" verticalAlign="top">
                {column.render ? (
                  column.render(row[column.dataIndex], row, rowIndex)
                ) : (
                  <Text>{row[column.dataIndex]}</Text>
                )}
              </Td>
            ))}
          </Tr>
        ))}

        {data?.length === 0 && (
          <Tr>
            <Td colSpan={columns.length}>
              <Text textAlign="center">{t('no_data')}</Text>
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  )
}

export default CustomizedTable
