import models from '.'

export interface Cart {
  user_email?: string
  cart_products?: CartProduct[]
  voucher_codes?: string[]
  new_address?: models.UserAddress
  address?: number
  pickup?: boolean
  delivery_method?: number
  comment?: string
  currency?: number
  payment_method?: number
}

export interface CartProduct {
  quantity: number
  product: number
}

export interface CartProductBulk {
  products: CartProduct[]
}

export interface ProductWithInfo {
  created_at: string
  updated_at: string
  id: number
  quantity: number
  price: string
  product: models.Product
}

export interface CartResponse {
  id: number
  products: models.ProductWithInfo[]
  updated_at: string
  user: number
}

export interface CartCalculation {
  delivery_method: number
  delivery_price: number
  discounted_amount: number
  price: number
  regular_price: number
  tax_amount: number
  voucher_codes: string[]
}
