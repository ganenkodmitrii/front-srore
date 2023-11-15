export interface Category {
  id: number
  saas_account: number
  image: string
  created_at: string
  updated_at: string
  seo_name: string
  seo_description: string
  canonical_url: string
  meta_keywords: string
  main_image_title: string
  name: string
  slug: string
  description: string
  visible: boolean
  visible_for_users: boolean
  show_in_menu: boolean
  order_products_brand: boolean
  filter_mark: boolean
  position: number
  lft: number
  rght: number
  tree_id: number
  level: number
  parent: number
}

export interface CategoryWithSubcategories {
  id: number
  name: string
  subcategories?: CategoryWithSubcategories[]
}
