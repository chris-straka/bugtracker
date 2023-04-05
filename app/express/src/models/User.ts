export interface UserDB {
  id: string
  username: string
  email: string
  password: string
  role: 'admin' | 'project_manager' | 'developer' | 'contributor'
}

export type User = Omit<UserDB, 'password'>