export interface ProjectComment {
  id: number
  owner_id: number
  project_id: number
  comment: string
  created_at: Date
  last_modified_at: Date
}
