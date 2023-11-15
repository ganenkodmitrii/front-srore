import models from '.'

interface Default {
  id: number
  created_at: string
  updated_at: string
  is_active: boolean
}

export enum Codenames {
  PAYPAL_CLIENT_KEY = 'paypal_client_key',
  PAY_ON_DELIVERY = 'pay_on_delivery',
  PAYPAL_IS_ACTIVE = 'paypal_is_active',
}

export interface Settings extends Default {
  name: string
  value: string
  description: string
  saas_account: string
  codename: Codenames
}

export interface DeliveryMethod extends Default {
  name: string
  tracking_url: string
  logo: string
}

export interface DeliverySetting extends Default {
  delivery_method: DeliveryMethod
  prices: models.Price[]
  settings: string
  saas_account: string
}

export interface AddressSetting extends Default {
  saas_account: string
  address: models.UserAddress
}
