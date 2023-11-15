import models from '@/src/models'

export enum RoleTypes {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}
export interface User {
  id: number
  cart_products_count: number
  currency: models.Currency
  password: string
  last_login?: string
  is_superuser?: boolean
  first_name: string
  last_name: string
  is_staff?: boolean
  is_active?: boolean
  date_joined?: string
  created_at: string
  updated_at: string
  email: string
  sso_id?: string
  phone_number?: string
  role: RoleTypes
  birthday?: string
  notifications_config?: any
  saas_account: number
  groups?: number[]
  user_permissions?: number[]
  addresses: number[]
}
