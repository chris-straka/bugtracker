export interface Project {
  id: number
  owner_id: number
  name: string
  description: string
  comments?: ProjectComment[]
}

export interface ProjectComment {
  id: number
  owner_id: number
  name: string
  description: string
}
