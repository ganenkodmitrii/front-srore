import { addressesQueries as addresses } from './addresses'
import { brandsQueries as brands } from './brands'
import { cartQueries as cart } from './cart'
import { categoriesQueries as categories } from './categories'
import { contentDeliveryQueries as contentDelivery } from './content-delivery'
import { ordersQueries as orders } from './orders'
import { paypalQueries as paypal } from './paypal'
import { productsQueries as products } from './products'
import { profileQueries as profile } from './profile'
import { settingsQueries as settings } from './settings'
import { userAddressQueries as userAddress } from './user-address'

const queries = {
  addresses,
  brands,
  cart,
  categories,
  contentDelivery,
  orders,
  paypal,
  products,
  profile,
  settings,
  userAddress,
}

export default queries
