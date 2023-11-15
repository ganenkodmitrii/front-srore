import { Currency } from './currency'

export interface Price {
  id: number
  created_at: string
  updated_at: string
  price: string
  discounted_price: string
  purchased_price: string
  currency: Currency
  product: number
  discount_percent: string
}
