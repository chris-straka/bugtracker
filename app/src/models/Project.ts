export type ProjectStatus = 'active' | 'completed' | 'archived'
export const ProjectStatusArray = ['active', 'completed', 'archived'] as const

export interface Project {
  id: number
  owner_id: number
  name: string
  description: string
  status: ProjectStatus
  created_at: Date
  last_modified_at: Date
}
