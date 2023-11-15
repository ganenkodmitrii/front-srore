import models from '../models'

export const addProductToCart = (
  cart: models.CartFormValues,
  productId: number,
  quantity = 1,
): models.CartFormValues => {
  const updatedCart = { ...cart }
  const existingCartItemIndex = (updatedCart.cart_products || []).findIndex((item) => item.product === productId)

  if (updatedCart.cart_products?.[existingCartItemIndex]) {
    updatedCart.cart_products[existingCartItemIndex].quantity += quantity
  } else {
    updatedCart.cart_products = [...(updatedCart.cart_products || []), { product: productId, quantity: quantity }]
  }

  return updatedCart
}

export const removeProductFromCart = (cart: models.CartFormValues, productId: number): models.CartFormValues => {
  const newCart = {
    ...cart,
    products: cart.products?.filter((item) => item.product.id !== productId),
    cart_products: cart.cart_products?.filter((item) => item.product !== productId),
  }
  return newCart
}

export const updateProductQuantity = (
  cart: models.CartFormValues,
  productId: number,
  quantity: number,
): models.CartFormValues => {
  const newCart = {
    ...cart,
    cart_products: cart.cart_products?.map((item) => {
      if (item.product === productId) {
        item.quantity = quantity
      }
      return item
    }),
    products: cart.products?.map((item) => {
      if (item.product.id === productId) {
        item.quantity = quantity
      }
      return item
    }),
  }

  return newCart
}

export const removeBulkFromCart = (cart: models.CartFormValues, productIds: number[]): models.CartFormValues => {
  const newCart = {
    ...cart,
    cart_products: cart.cart_products?.filter((item) => !productIds.includes(item.product)),
    products: cart.products?.filter((item) => !productIds.includes(item.product.id)),
  }
  return newCart
}

export const addBulkToCart = (cart: models.CartFormValues, products?: models.CartProduct[]): models.CartFormValues => {
  if (!products) return cart

  const updatedCart = { ...cart }

  // update existing products
  updatedCart.cart_products = updatedCart.cart_products?.map((item) => {
    const product = products.find((p) => p.product === item.product)
    if (product) item.quantity += product.quantity

    return item
  })

  // add new products
  const newProducts = products.filter((item) => !updatedCart.cart_products?.find((p) => p.product === item.product))
  updatedCart.cart_products = [...(updatedCart.cart_products || []), ...newProducts]

  updatedCart.products = []

  return updatedCart
}
