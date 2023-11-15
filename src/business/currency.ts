import { toFixedIfNecessary } from '@/src/utils'

export enum Currency {
  MDL = 'MDL',
  EUR = 'EUR',
  USD = 'USD',
}

export const currencyPositionMap = {
  [Currency.MDL]: 'right',
  [Currency.EUR]: 'left',
  [Currency.USD]: 'left',
} satisfies Record<Currency, 'left' | 'right'>

export const currencySymbolMap = {
  [Currency.MDL]: 'lei',
  [Currency.EUR]: '€',
  [Currency.USD]: '$',
} satisfies Record<Currency, string>

export const formatNumber = (price: string) => {
  // 20000 -> 20 000
  return price.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const formatPriceWithCurrency = (
  price: number | string = 0,
  currency = Currency.USD as keyof typeof Currency,
): string => {
  if (typeof price === 'string') price = parseFloat(price)

  const symbol = currencySymbolMap[currency]
  const position = currencyPositionMap[currency]
  const fixedPrice = toFixedIfNecessary(price, 2)
  const formattedPrice = formatNumber(fixedPrice)

  return position === 'right' ? `${formattedPrice} ${symbol}` : `${symbol} ${formattedPrice}`
}
