export type Roles = 'owner' | 'admin' | 'contributor' | 'developer' | 'tester' | 'quality_assurance' | 'project_manager' | 'guest'

export type TicketStatus = 'open' | 'in_progress' | 'closed' | 'additional_info_required'
export type TicketPriority = 'none' | 'low' | 'medium' | 'high' | 'criticial'
export type TicketType = 'bug' | 'feature_request' | 'task' | 'documentation' | 'improvement' | 'question'

export type ProjectStatus = 'active' | 'completed' | 'archived'

declare module 'express-session' {
  interface SessionData {
    userId: string | null,
    userRole: Roles | null
  }
}