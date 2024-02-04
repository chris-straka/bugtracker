export type TicketPriority = 'none' | 'low' | 'medium' | 'high' | 'critical'
export const TicketPriorityArray = ['none', 'low', 'medium', 'high', 'critical'] as const

export type TicketType = 'bug' | 'feature_request' | 'task' | 'documentation' | 'improvement' | 'question'
export const TicketTypeArray = ['bug', 'feature_request', 'task', 'documentation', 'improvement', 'question'] as const

export type TicketStatus = 'open' | 'in_progress' | 'closed' | 'additional_info_required'
export const TicketStatusArray = ['open', 'in_progress', 'closed', 'additional_info_required'] as const


export interface Ticket {
  id: number
  project_id: number
  owner_id: number
  name: string
  description: string
  priority: TicketPriority
  type: TicketType
  status: TicketStatus
  created_at: Date
  last_modified_at: Date
}
