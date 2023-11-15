import models from '.'
export interface TokensResponse {
  access: string
  refresh: string
}

export interface ActivationResponse {
  uid: string
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  id: number
  email: string
  password: string
  first_name?: string
  last_name?: string
  phone_number?: string
  birthday?: string
  notifications_config?: any
  currency?: number
  cart_products?: models.CartProductBulk[]
  favorite_products?: number[]
  redirect_url: string
}

export interface ResetPasswordConfirmation {
  uid: string
  token: string
  new_password: string
}
