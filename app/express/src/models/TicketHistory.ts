export interface TicketHistory {
  id: number
  ticket_id: number
  changer_id: number
  changed_fields: string[]
  previous_values: string[]
  new_values: string[]
  date: Date
}
