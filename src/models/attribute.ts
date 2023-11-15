export interface Attribute {
  id: number
  created_at: string
  updated_at: string
  name: string
  codename: string
  description: string
}

export interface AttributeValue {
  id: number
  created_at: string
  updated_at: string
  attribute_id: number
  attribute: Attribute
  type: string
  image: string
  value: string
  is_different: boolean
}
