export interface BaseUser {
  id: number
  username: string
  email: string
  role: UserRole
}

export interface AuthUser extends BaseUser {
  password: string 
  account_status: string
}

export interface UserAccountStatusObject {
  account_status: UserAccountStatus
}

export interface UserAccountDetails extends BaseUser {
  created_at: Date
  last_modified_at: Date
}

export type AdminRole = 'owner' | 'admin'
export const AdminRoleArray = ['owner', 'admin'] as const

export type UserRole = 'owner' | 'admin' | 'project_manager' | 'contributor' | 'developer' | 'tester' | 'quality_assurance' 
export const UserRolesArray = ['owner', 'admin', 'project_manager', 'contributor', 'developer', 'tester', 'quality_assurance'] as const

export type UserAccountStatus = 'active' | 'disabled'
export const UserAccountStatusArray = ['active', 'disabled'] as const
