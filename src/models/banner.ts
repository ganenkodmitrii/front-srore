export enum SizeTypes {
  SMALL = 'small',
  LARGE = 'large',
}

export interface Image {
  content_type?: string
  height?: number
  id: string
  name?: string
  size?: number
  url: string
  width?: number
}

export interface ItemsBanner {
  description?: string
  url?: string
  title?: string
  image?: Image
  promotion_period_start?: string
  promotion_period_end?: string
  size?: SizeTypes
}

export interface Banner {
  created_at?: string
  id?: string
  modified_at: string
  name: string
  publish_date?: string
  items: ItemsBanner[]
  slug?: string
  status?: string
  type_id?: string
}
