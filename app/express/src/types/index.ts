export type Roles = 'owner' | 'admin' | 'contributor' | 'developer' | 'tester' | 'quality_assurance' | 'project_manager' | 'guest'

export type TicketStatus = 'open' | 'in_progress' | 'closed' | 'on_hold'
export type TicketPriority = 'low' | 'medium' | 'high' | 'criticial'
export type TicketType = 'bug' | 'feature_request' | 'task' | 'documentation' | 'improvement' | 'question'

declare module 'express-session' {
  interface SessionData {
    userId: string | null,
    userRole: Roles | null
  }
}