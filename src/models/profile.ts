export interface UserDetails {
  last_name: string
  first_name: string
  phone_number: string
  birthday: string | null
  email?: string
}

export interface SetNewPassword {
  current_password: string
  new_password: string
}

export interface SetNewEmail {
  current_password: string
  new_email: string
}

export interface DeleteAccount {
  current_password: string
}
