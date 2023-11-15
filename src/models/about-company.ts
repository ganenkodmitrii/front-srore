import models from '@/src/models'

export interface CompanyTeam {
  name: string
  position: string
  photo: models.Image
}

export interface CompanyValue {
  description: string
  title: string
  icon: models.Image
}

export interface CompanyStatistics {
  description: string
  value: string
}
