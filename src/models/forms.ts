import { Currency } from '@/src/business'

import models from '.'

export interface CartFormValues extends models.Cart {
  products?: models.ProductWithInfo[]
  payment?: 'cash' | 'card'
  terms_and_conditions?: boolean
  notifications?: boolean
  currency_code: keyof typeof Currency
  contact_info?: Partial<models.UserDetails>
  isCartReady: boolean
}
