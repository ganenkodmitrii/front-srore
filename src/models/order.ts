import models from '.'

export enum OrderStatus {
  Placed = 'placed',
  Processed = 'processed',
  Shipped = 'shipped',
  Delivered = 'delivered',
  CanceledByUser = 'canceled_by_user',
  Returned = 'returned',
}

export interface PaymentMethod {
  created_at: string
  id: number
  is_active: boolean
  logo: string
  name: string
  updated_at: string
}

export interface Order {
  id: number
  products_count: number
  tracking_link: string
  payment_method: models.PaymentMethod
  address: models.UserAddress
  currency: models.Currency
  cart_products: models.ProductWithInfo[]
  created_at: string
  updated_at: string
  uid: string
  payment_status: string
  status: OrderStatus
  tracking_number: string
  pickup: boolean
  confirmed_by_user: boolean
  price: number
  regular_price: number
  discounted_amount: number
  delivery_price: number
  tax_amount: number
  comment: string
  voucher_codes: string[]
}
