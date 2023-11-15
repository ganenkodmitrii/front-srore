export interface ProductsFiltersState {
  search?: string
  ordering?: string
  price_gte?: number
  price_lte?: number
  categories?: number[]
  brand?: number[]
  page?: number
  per_page?: number
}

export const defaultPagination = {
  page: 1,
  per_page: 12,
}

export const defaultSelectPagination = {
  page: 1,
  per_page: 100,
}
