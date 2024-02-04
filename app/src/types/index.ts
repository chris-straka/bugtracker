import type { UserRole } from '../models/User'

declare module 'express-session' {
  interface SessionData {
    userId: string | null,
    userRole: UserRole | null
  }
}