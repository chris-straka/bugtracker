export type Roles = 'owner' | 'admin' | 'project_manager' | 'contributor' | 'developer' | 'tester' | 'quality_assurance' 
export const RolesArr = ['owner', 'admin', 'project_manager', 'contributor', 'developer', 'tester', 'quality_assurance'] as const

export type TicketPriority = 'none' | 'low' | 'medium' | 'high' | 'critical'
export const TicketPriorityArr = ['none', 'low', 'medium', 'high', 'critical'] as const

export type TicketType = 'bug' | 'feature_request' | 'task' | 'documentation' | 'improvement' | 'question'
export const TicketTypeArr = ['bug', 'feature_request', 'task', 'documentation', 'improvement', 'question'] as const

export type TicketStatus = 'open' | 'in_progress' | 'closed' | 'additional_info_required'
export const TicketStatusArr = ['open', 'in_progress', 'closed', 'additional_info_required'] as const

export type ProjectStatus = 'active' | 'completed' | 'archived'
export const ProjectStatusArr = ['active', 'completed', 'archived'] as const

declare module 'express-session' {
  interface SessionData {
    userId: string | null,
    userRole: Roles | null
  }
}