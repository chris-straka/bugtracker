import { Roles } from '../types'

export type UserWithPassword = {
  id: number
  username: string
  email: string
  password: string
  role: Roles
}

export type User = Omit<UserWithPassword, 'password'>