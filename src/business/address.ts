import models from '@/src/models'

export const formatAddress = (address?: models.UserAddress) => {
  if (!address) return ''

  const addressData = [
    address?.street,
    address?.street_number,
    address?.house,
    address?.house_number,
    address?.floor,
    address?.apartment,
    address?.city?.name,
    address?.subregion?.name,
    address?.region?.name,
    address?.country?.name,
    address?.postal_code,
  ]
    .filter(Boolean)
    .join(', ')

  return addressData
}
