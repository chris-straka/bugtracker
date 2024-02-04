import type { TicketType, TicketPriority, TicketStatus } from './Ticket'

export type TicketStatistic = { 
  priority: TicketPriority
  type: TicketType
  status: TicketStatus
  projectName: string
}