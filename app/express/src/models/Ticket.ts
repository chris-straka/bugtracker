export interface Ticket {
  id: number
  owner_id: number
  name: string
  priority: string
  type: string
  status: string
  description: string
  comments?: TicketComment[]
}

export interface TicketComment {
  id: number
  owner: number
  description: string
  ticket_id: number
}