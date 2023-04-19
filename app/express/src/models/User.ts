export type UserWithPassword = {
  id: number
  username: string
  email: string
  password: string
  role: 'admin' | 'project_manager' | 'developer' | 'contributor'
}

export type User = Omit<UserWithPassword, 'password'>