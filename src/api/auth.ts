import { AxiosResponse } from 'axios'
import i18next from 'i18next'

import api from '@/src/api'
import { ACCESS_TOKEN_KEY, CART_INFO_KEY, FAVORITES_KEY, REFRESH_TOKEN_KEY } from '@/src/app-constants'
import models from '@/src/models'

import { mainAxios, pureAxios } from './axios'

export const clearLocalStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(CART_INFO_KEY)
}

export const auth = {
  logout: async () => {
    try {
      await mainAxios.get('/', {
        headers: { Authorization: `Token ${localStorage.getItem(ACCESS_TOKEN_KEY)}` },
      })
    } finally {
      clearLocalStorage()
    }
  },
  register: async (user: models.FormData<models.RegisterCredentials>) => {
    const ids = localStorage.getItem(FAVORITES_KEY)
    const { data } = await mainAxios.post('/users', {
      ...user,
      favorite_products: ids?.split(','),
      cart_products: JSON.parse(localStorage.getItem(CART_INFO_KEY) || 'null')?.cart_products,
      redirect_url: `${process.env.NEXT_PUBLIC_DOMAIN}/${i18next.language}/activate/{uid}/{token}`,
    })
    localStorage.removeItem(FAVORITES_KEY)
    localStorage.removeItem(CART_INFO_KEY)

    return data
  },
  activation: async (credentials: models.ActivationResponse) => {
    await mainAxios.post(`/users/activation`, credentials)
  },
  login: async (credentials: models.LoginCredentials) => {
    const { data } = await mainAxios.post<models.LoginCredentials, AxiosResponse<models.TokensResponse>>(
      '/jwt/create',
      credentials,
    )

    localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)

    try {
      const favoritesIds = localStorage.getItem(FAVORITES_KEY)
      favoritesIds && (await api.products.postFavoriteBulk(favoritesIds))
      localStorage.removeItem(FAVORITES_KEY)
      const cart: models.CartFormValues = JSON.parse(localStorage.getItem(CART_INFO_KEY) || '{}')
      cart.cart_products && (await api.cart.products.addBulk(cart.cart_products))
    } catch (err) {
      /* empty */
    }
  },
  refresh: async () => {
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY)
    try {
      const { data: tokens } = await pureAxios.post<models.TokensResponse>(`/jwt/refresh`, {
        refresh: refreshToken,
      })
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access || '')
      return tokens.access
    } catch (err) {
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
  },
  verify: async (token: string) => {
    return await mainAxios.post('/jwt/verify', { token: token })
  },
  resetPassword: async (email: string) => {
    await mainAxios.post(`/users/reset_password`, {
      email: email,
      redirect_url: `${process.env.NEXT_PUBLIC_DOMAIN}/${i18next.language}/password/reset/confirm/{uid}/{token}`,
    })
  },
  resetPasswordConfirm: async (credentials: models.ResetPasswordConfirmation) => {
    await mainAxios.post(`/users/reset_password_confirm`, credentials)
  },
}
