import { createQueryKeys } from '@lukemorales/query-key-factory'
import queryString from 'query-string'

import models from '@/src/models'

import { mainAxios } from './axios'

export const addresses = {
  getPaginatedCountries: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.WithResults<models.Country>>(
      queryString.stringifyUrl({ url: '/addresses/countries', query: queryParams }),
    )
    return data
  },
  getAllCountries: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.Country[]>(
      queryString.stringifyUrl({ url: '/addresses/countries/all', query: queryParams }),
    )
    return data
  },
  getCountryById: async (id: number) => {
    const { data } = await mainAxios.get<models.Country>(`/addresses/countries/${id}`)
    return data
  },

  getPaginatedRegions: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.WithResults<models.Region>>(
      queryString.stringifyUrl({ url: '/addresses/regions', query: queryParams }),
    )
    return data
  },
  getRegionById: async (id: number) => {
    const { data } = await mainAxios.get<models.Region>(`/addresses/regions/${id}`)
    return data
  },

  getPaginatedSubRegions: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.WithResults<models.SubRegion>>(
      queryString.stringifyUrl({ url: '/addresses/subregions', query: queryParams }),
    )
    return data
  },
  getSubRegionById: async (id: number) => {
    const { data } = await mainAxios.get<models.SubRegion>(`/addresses/subregions/${id}`)
    return data
  },

  getPaginatedCities: async (queryParams?: models.GenericObject) => {
    const { data } = await mainAxios.get<models.WithResults<models.City>>(
      queryString.stringifyUrl({ url: '/addresses/cities', query: queryParams }),
    )
    return data
  },
  getCityById: async (id: number) => {
    const { data } = await mainAxios.get<models.City>(`/addresses/cities/${id}`)
    return data
  },
}

export const addressesQueries = createQueryKeys('addresses', {
  getPaginatedCountries: (params = {}) => ({
    queryKey: [params],
    queryFn: () => addresses.getPaginatedCountries(params),
  }),

  getAllCountries: (params = {}) => ({
    queryKey: [params],
    queryFn: () => addresses.getAllCountries(params),
  }),

  getCountryById: (id) => ({
    queryKey: [id],
    queryFn: () => addresses.getCountryById(id),
  }),

  getPaginatedRegions: (params = {}) => ({
    queryKey: [params],
    queryFn: () => addresses.getPaginatedRegions(params),
  }),

  getRegionById: (id) => ({
    queryKey: [id],
    queryFn: () => addresses.getRegionById(id),
  }),

  getPaginatedSubRegions: (params = {}) => ({
    queryKey: [params],
    queryFn: () => addresses.getPaginatedSubRegions(params),
  }),

  getSubRegionById: (id) => ({
    queryKey: [id],
    queryFn: () => addresses.getSubRegionById(id),
  }),

  getPaginatedCities: (params = {}) => ({
    queryKey: [params],
    queryFn: () => addresses.getPaginatedCities(params),
  }),

  getCityById: (id) => ({
    queryKey: [id],
    queryFn: () => addresses.getCityById(id),
  }),
})
