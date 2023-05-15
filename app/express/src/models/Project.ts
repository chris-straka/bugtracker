import { ProjectStatus } from '../types'

export interface Project {
  id: number
  owner_id: number
  name: string
  description: string
  status: ProjectStatus
}


export interface ProjectComment {
  id: number
  owner_id: number
  name: string
  description: string
}
