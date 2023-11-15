import { useState } from 'react'

import { Divider, Input, Text } from '@chakra-ui/react'

import { useSet, useUpdateEffect, useThrottledState } from '@react-hookz/web'

import api from '@/src/api'
import queries from '@/src/api/queries'
import { ProductsFiltersState, defaultPagination } from '@/src/business'
import { PriceFilter, FiltersBox } from '@/src/components'
import { useTranslation } from '@/src/i18n'

interface ProductsFiltersProps {
  initialFiltersValue?: ProductsFiltersState
  onFiltersChange?: React.Dispatch<React.SetStateAction<ProductsFiltersState>>
}

const ProductsFilters = ({ initialFiltersValue, onFiltersChange }: ProductsFiltersProps) => {
  const { t } = useTranslation()

  const [priceMin, setPriceMin] = useState(initialFiltersValue?.price_gte)
  const [priceMax, setPriceMax] = useState(initialFiltersValue?.price_lte)

  const [brandsSearch, setBrandsSearch] = useThrottledState('', 700)
  const [categoriesSearch, setCategoriesSearch] = useThrottledState('', 700)

  const categories = useSet(initialFiltersValue?.categories)
  const brands = useSet(initialFiltersValue?.brand)

  useUpdateEffect(() => {
    // We need to set all the properties at the same time as when they change too fast
    // they can destroy the previous value of the other ones
    onFiltersChange?.((prev) => ({
      ...prev,
      price_gte: priceMin,
      price_lte: priceMax,
      categories: Array.from(categories.values()),
      // brand is used in singular on API somewhy
      brand: Array.from(brands.values()),
      // reset page to 1 when filters change
      page: 1,
    }))
    // The set reference is not changing so we keep track of it's size (e.g. categories.size)
  }, [priceMin, priceMax, categories, categories.size, brands, brands.size, onFiltersChange])

  const handleCategoryChange = (id: number) => (categories.has(id) ? categories.delete(id) : categories.add(id))
  const handleBrandChange = (id: number) => (brands.has(id) ? brands.delete(id) : brands.add(id))

  const queryKeyBrands = queries.brands.getPaginated({ ...defaultPagination, search: brandsSearch }).queryKey
  const queryFnBrands = ({ pageParam = 1 }) =>
    api.brands.getPaginated({ ...defaultPagination, page: pageParam, search: brandsSearch })

  const queryKeyCategories = queries.categories.getPaginated({
    ...defaultPagination,
    search: categoriesSearch,
  }).queryKey
  const queryFnCategories = ({ pageParam = 1 }) =>
    api.categories.getPaginated({ ...defaultPagination, page: pageParam, search: categoriesSearch })

  return (
    <>
      <Text as="h4" mb="8px">
        {t('price')}
      </Text>
      <PriceFilter
        initialPriceMin={priceMin}
        initialPriceMax={priceMax}
        onPriceMinChange={setPriceMin}
        onPriceMaxChange={setPriceMax}
      />

      <Divider my="16px" />

      <Text as="h4" mb="8px">
        {t('categories')}
      </Text>

      <Input
        size="xs"
        mb="10px"
        width="100%"
        placeholder={t('search')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoriesSearch(e.target.value)}
      />

      <FiltersBox
        checkedItems={initialFiltersValue?.categories}
        onChange={handleCategoryChange}
        queryKey={queryKeyCategories}
        queryFn={queryFnCategories}
      />

      <Text as="h4" mt="16px" mb="8px">
        {t('brands')}
      </Text>

      <Input
        size="xs"
        mb="10px"
        width="100%"
        placeholder={t('search')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrandsSearch(e.target.value)}
      />

      <FiltersBox
        className="scroll-x"
        checkedItems={initialFiltersValue?.brand}
        onChange={handleBrandChange}
        queryKey={queryKeyBrands}
        queryFn={queryFnBrands}
      />
    </>
  )
}

export default ProductsFilters
