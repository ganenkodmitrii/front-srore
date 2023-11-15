import $axios from 'axios'

import { authInterceptor, languageInterceptor } from '@/src/api/axios/interceptors'
import { API_POST_CONTENT_TYPE } from '@/src/app-constants'

export const mainAxios = $axios.create({
  headers: {
    'Content-Type': API_POST_CONTENT_TYPE,
    'Saas-App-Token': process.env.NEXT_PUBLIC_SAAS_APP_TOKEN,
  },
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
})

export const pureAxios = $axios.create(mainAxios.defaults)

export const cmsAxios = $axios.create({
  headers: {
    'Saas-App-Token': process.env.NEXT_PUBLIC_CMS_SAAS_APP_TOKEN,
    'Cache-Control': 'no-cache', // Disable old cached on backend
  },
  baseURL: process.env.NEXT_PUBLIC_CMS_API,
})

mainAxios.interceptors.request.use(authInterceptor)
mainAxios.interceptors.request.use(languageInterceptor)
cmsAxios.interceptors.request.use(languageInterceptor)
