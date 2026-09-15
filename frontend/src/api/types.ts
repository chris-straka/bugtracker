/** DTOs mirroring the Express API responses. */

export interface User {
  id: number
  username: string
  email: string
  role: string
}

export interface Project {
  id: number
  name: string
  description: string
  status?: string
  owner_id?: number
  created_at?: string
}

export interface Ticket {
  id: number
  project_id: number
  name: string
  description: string
  type?: string
  priority?: string
  status?: string
  created_at?: string
}

export interface Comment {
  id: number
  comment: string
  user_id?: number
  username?: string
  created_at?: string
}

export interface ProjectMember {
  id: number
  username: string
  email: string
  role: string
}

export interface Paged<T> {
  items: T[]
  nextCursor: string | null
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type AuthMode = 'session' | 'jwt'
