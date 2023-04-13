export type Roles = 'admin' | 'contributor' | 'developer' | 'project_manager'

declare module 'express-session' {
  interface SessionData {
    userId: string | null,
    userRole: Roles | null
  }
}