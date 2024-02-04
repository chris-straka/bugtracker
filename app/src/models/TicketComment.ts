export interface TicketComment {
  id: number
  owner_id: number
  ticket_id: number
  comment: string
  created_at: Date
  last_modified_at: Date
}