import type { Pool } from 'pg'
import type { ProjectComment } from '../../models/ProjectComment'
import { execute, queryExists } from '../../db/query'

export interface IProjectCommentRepository {
  createProjectComment(projectId: string, ownerId: string, comment: string): Promise<ProjectComment>
  projectCommentExists(commentId: string): Promise<boolean>
  getProjectCommentById(commentId: string): Promise<ProjectComment>
  getProjectCommentOwnerId(commentId: string): Promise<number>
  getProjectComments(projectId: string): Promise<ProjectComment[]>
  updateProjectComment(commentId: string, newComment: string): Promise<ProjectComment>
  deleteProjectComment(commentId: string): Promise<boolean>
}

export class ProjectCommentRepository implements IProjectCommentRepository {
  #pool: Pool

  constructor(dbPool: Pool) {
    this.#pool = dbPool
  }

  async createProjectComment(projectId: string, ownerId: string, comment: string) {
    const data = await this.#pool.query<ProjectComment>({
      name: 'create_project_comment',
      text: 'INSERT INTO project_comment(project_id, owner_id, comment) VALUES ($1, $2, $3) RETURNING *;',
      values: [projectId, ownerId, comment],
    })

    return data.rows[0]
  }

  async projectCommentExists(commentId: string) {
    return queryExists(this.#pool, {
      name: 'project_comment_exists',
      text: 'SELECT 1 FROM project_comment WHERE id = $1;',
      values: [commentId],
    })
  }

  async getProjectCommentById(commentId: string) {
    const data = await this.#pool.query<ProjectComment>({
      name: 'get_project_comment_by_id',
      text: 'SELECT * FROM project_comment WHERE id = $1;',
      values: [commentId],
    })
    return data.rows[0]
  }

  async getProjectCommentOwnerId(commentId: string) {
    const data = await this.#pool.query<{ owner_id: number }>({
      name: 'get_project_comment_owner_id',
      text: 'SELECT owner_id FROM project_comment WHERE id = $1;',
      values: [commentId],
    })

    return data.rows[0].owner_id
  }

  async getProjectComments(projectId: string) {
    const data = await this.#pool.query<ProjectComment>({
      name: 'get_project_comments',
      text: 'SELECT * FROM project_comment WHERE project_id = $1 ORDER BY id ASC;',
      values: [projectId],
    })
    return data.rows
  }

  async updateProjectComment(commentId: string, newComment: string) {
    const data = await this.#pool.query<ProjectComment>({
      name: 'update_project_comment',
      text: 'UPDATE project_comment SET comment = $2 WHERE id = $1 RETURNING *;',
      values: [commentId, newComment],
    })

    return data.rows[0]
  }

  async deleteProjectComment(commentId: string) {
    return execute(this.#pool, {
      name: 'delete_project_comment',
      text: 'DELETE FROM project_comment WHERE id = $1;',
      values: [commentId],
    })
  }
}
