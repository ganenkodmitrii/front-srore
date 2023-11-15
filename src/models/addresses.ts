export interface City {
  id: number
  name: string
  region_id: number
  country_id: number
}

export interface Country {
  id: number
  name: string
  code2?: string
}

export interface Region {
  id: number
  name: string
  country_id: string
}

export interface SubRegion extends Region {
  region_id: number
}
