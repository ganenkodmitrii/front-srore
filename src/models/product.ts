import { AttributeValue, Brand, Category, Currency, Favorite, Warranty } from './exports'

export enum ProductTypes {
  SINGLE = 'single',
  WITH_VARIANTS = 'with_variants',
  VARIANT = 'variant',
}

export enum StockStateTypes {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  ON_ORDER = 'on_order',
  PRE_ORDER = 'pre_order',
}

export enum MarksTypes {
  SALE = 'sale',
  RECOMMENDED = 'recommended',
  NEW = 'new',
  BESTSELLER = 'bestseller',
}
export interface Product {
  id: number
  saas_account: number
  attachments: string[]
  currency: Currency
  price: string
  discounted_price: string
  discount_difference: string
  discount_percent: string
  attributes: AttributeValue[]
  warranty: Warranty
  brand: Brand
  categories: Category[][]
  variants: Product[]
  favorite: Favorite
  created_at: string
  updated_at: string
  seo_name: string
  seo_description: string
  canonical_url: string
  meta_keywords: string
  main_image_title: string
  name: string
  slug: string
  type: ProductTypes
  description: string
  short_description: string
  is_active: boolean
  show: boolean
  sku: string
  auto_sku: boolean
  group_sku: string
  upc: string[]
  has_discount: boolean
  has_tax: boolean
  tax_percent: string
  stock: number
  stock_max: number
  stock_state: StockStateTypes
  stock_min_order: number
  need_to_order: boolean
  video_link: string
  marks: MarksTypes[]
  auto_management: boolean
  delivery_time: string
  delivery_weight: string
  delivery_by_courier: boolean
  pickup: boolean
  pickup_time: string
  parent: Product
  relations: number[]
}
