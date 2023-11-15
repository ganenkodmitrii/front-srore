import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { Box, Checkbox, Text } from '@chakra-ui/react'

import { QueryFunctionContext, UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

import models from '@/src/models'

import { useTranslation } from '../i18n'

interface FiltersBoxProps {
  checkedItems?: number[]
  onChange: (id: number) => void
  className?: string
  queryKey: UseInfiniteQueryOptions<models.WithResults<models.GenericObject>, unknown, unknown>['queryKey']
  queryFn: (context: QueryFunctionContext) => Promise<models.WithResults<models.GenericObject>>
}

const FiltersBox = ({ checkedItems, onChange, queryFn, queryKey = [], className = '' }: FiltersBoxProps) => {
  const { t } = useTranslation()
  const { inView, ref } = useInView()

  const getNextPageParam = (lastPage: models.WithResults<models.GenericObject>) =>
    lastPage.current_page < lastPage.total_pages ? lastPage.current_page + 1 : undefined

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(queryKey, queryFn, { getNextPageParam })

  const optionsLength = data?.pages.reduce((acc, curr) => (acc += curr.results.length), 0)

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <Box maxH="200px" className={`scroll-y ${className}`}>
      {data && optionsLength == 0 && (
        <Text fontWeight="600" pl="6px">
          {t('no_results_found')}
        </Text>
      )}
      {data?.pages.map((page) =>
        page.results.map((elem, idx) => (
          <Box key={elem.id} ref={page.results.length === idx + 1 ? ref : null}>
            <Checkbox defaultChecked={checkedItems?.includes(elem.id)} onChange={() => onChange(elem.id)}>
              {elem.name}
            </Checkbox>
          </Box>
        )),
      )}
    </Box>
  )
}

export default FiltersBox
