import { InternalAxiosRequestConfig } from 'axios'

import api from '@/src/api'
import { ACCESS_TOKEN_KEY, COOKIE_LANGUAGE } from '@/src/app-constants'
import { fallbackLng } from '@/src/i18n'

let refreshAccessTokenPendingRequest: Promise<string | undefined> | null

export function isValidAccessToken(token: string | null): boolean {
  if (!token) {
    return false
  }

  const { exp } = JSON.parse(atob(token.split('.')[1]))
  const expirationDate = new Date(exp * 1000)
  return new Date() < expirationDate
}

export const renewAccessToken = async () => {
  if (refreshAccessTokenPendingRequest) {
    return await refreshAccessTokenPendingRequest
  }
  refreshAccessTokenPendingRequest = api.auth.refresh()
  const data = await refreshAccessTokenPendingRequest
  refreshAccessTokenPendingRequest = null
  return data
}

export const authInterceptor = async (config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (authToken) {
      if (!isValidAccessToken(authToken)) {
        try {
          const newAccessToken = await renewAccessToken()
          config.headers['Authorization'] = `Token ${newAccessToken}`
        } catch (err) {
          /* empty */
        }
      } else config.headers['Authorization'] = `Token ${authToken}`
    }
  }

  return config
}

export const languageInterceptor = async (config: InternalAxiosRequestConfig) => {
  let language
  if (typeof window !== 'undefined') {
    language = localStorage.getItem('i18nextLng') || fallbackLng
  } else {
    const { cookies } = await import('next/headers')

    language = cookies().get(COOKIE_LANGUAGE)?.value || fallbackLng
  }

  config.headers['Accept-Language'] = language

  return config
}
