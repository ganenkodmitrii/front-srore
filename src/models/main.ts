export interface WithResults<T> {
  total_pages: number
  current_page: number
  per_page: number
  results: T[]
}

export type GenericObject<T = any> = { [key in string | number | symbol]: T }

export type FormData<Type> = {
  [Property in keyof Type]?: Type[Property]
}
