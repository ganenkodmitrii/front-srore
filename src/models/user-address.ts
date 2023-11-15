import models from '@/src/models'

export enum ContinentTypes {
  OCEANIA = 'OC',
  EUROPE = 'EU',
  AFRICA = 'AF',
  NORTH_AMERICA = 'NA',
  SOUTH_AMERICA = 'SA',
  ANTARCTICA = 'AN',
  ASIA = 'AS',
}

interface UserAddressIntl {
  name_ascii?: string
  slug: string
  geoname_id?: number
  alternate_names?: string
}

export interface UserAddressCountry extends models.Country, UserAddressIntl {
  id: number
  code3?: string
  continent?: ContinentTypes
  tld?: string
  phone?: string
}
export interface UserAddressRegion extends models.Region, UserAddressIntl {
  id: number
  display_name: string
  geoname_code?: string
}
export interface UserAddressSubregion extends models.SubRegion, UserAddressIntl {
  id: number
  display_name: string
  geoname_code?: string
}
export interface UserAddressCity extends models.City, UserAddressIntl {
  id: number
  display_name?: string
  search_names?: string
  latitude?: string
  longitude?: string
  population?: number
  feature_code?: string
  timezone?: string
}
export interface UserAddress {
  id: number
  saas_account: number
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  phone: string
  email: string
  name?: string
  street: string
  street_number?: string
  house?: string
  house_number?: string
  floor?: string
  apartment?: string
  postal_code: string
  longitude?: string
  latitude?: string
  comment?: string
  city: UserAddressCity | null
  subregion?: UserAddressRegion | null
  region?: UserAddressSubregion | null
  country: UserAddressCountry | null
}

export interface UserAccountAddress {
  id: number
  saas_account: number
  address: UserAddress
  created_at: string
  updated_at: string
  is_default: boolean
}
