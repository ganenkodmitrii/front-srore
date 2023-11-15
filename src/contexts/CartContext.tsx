'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { CART_INFO_KEY } from '@/src/app-constants'
import { Currency } from '@/src/business'

import models from '../models'

import { useAuth } from '.'

interface CartContextType {
  cart: models.CartFormValues
  setCart: React.Dispatch<React.SetStateAction<models.CartFormValues>>
}

const defaultCart: models.CartFormValues = {
  products: undefined,
  new_address: undefined,

  contact_info: undefined,
  cart_products: undefined,
  voucher_codes: undefined,
  address: undefined,
  delivery_method: undefined,
  payment_method: undefined,
  payment: undefined,
  comment: undefined,

  currency_code: Currency.USD,
  terms_and_conditions: undefined,
  notifications: undefined,
  pickup: undefined,
  isCartReady: false,
}

const CartContext = createContext<CartContextType | undefined>({
  cart: defaultCart,
  setCart: () => {
    throw new Error('setCart function must be overridden by a provider')
  },
})

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState(defaultCart)
  const { isAuth } = useAuth()

  useQuery(
    queries.cart.get().queryKey,
    async () => JSON.parse(localStorage.getItem(CART_INFO_KEY) ?? 'null') || defaultCart,
    {
      enabled: !isAuth,
      onSuccess: (data) => setCart({ ...data, isCartReady: true }),
    },
  )

  useEffect(() => {
    cart !== defaultCart &&
      localStorage.setItem(
        CART_INFO_KEY,
        JSON.stringify({
          products: cart.products,
          new_address: cart.new_address,

          contact_info: cart.contact_info,
          cart_products: cart.cart_products,
          voucher_codes: cart.voucher_codes,
          address: cart.address,
          delivery_method: cart.delivery_method,
          payment_method: cart.payment_method,
          payment: cart.payment,
          comment: cart.comment,

          currency_code: cart.currency_code,
          terms_and_conditions: cart.terms_and_conditions,
          notifications: cart.notifications,
          pickup: cart.pickup,
          isCartReady: cart.isCartReady,
        }),
      )
  }, [cart])

  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>
}
