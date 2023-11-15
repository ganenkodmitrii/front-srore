import { Currency as CurrencyEnum } from '@/src/business'

export interface Currency {
  id: number
  name: string
  name_en: string
  name_ro: string
  name_ru: string
  code: keyof typeof CurrencyEnum
  symbol: string
  is_active: boolean
  created_at: string
  updated_at: string
}
