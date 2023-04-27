import { Ticket } from './Ticket'

export interface Project {
  id: number
  owner_id: number
  name: string
  description: string
  comments: ProjectComment[]
  tickets: Ticket[]
}


export interface ProjectComment {
  id: number
  owner_id: number
  name: string
  description: string
}
