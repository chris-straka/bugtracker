import type { Pool } from 'pg'
import type { ProjectComment } from '../../models/ProjectComment'

export interface IProjectCommentRepository {
  createProjectComment(projectId: string, ownerId: string, comment: string): Promise<ProjectComment>,
  getProjectCommentById(commentId: string): Promise<ProjectComment>,
  getProjectComments(projectId: string): Promise<ProjectComment[]>,
  updateProjectComment(commentId: string, newComment: string): Promise<ProjectComment>,
  deleteProjectComment(commentId: string): Promise<boolean>
}

export class ProjectCommentRepository implements IProjectCommentRepository {
  #pool: Pool

  constructor(dbPool: Pool) {
    this.#pool = dbPool 
  }

  async createProjectComment(
    projectId: string, 
    ownerId: string, 
    comment: string
  ) {
    const data = await this.#pool.query<ProjectComment>({
      name: 'create_project_comment',
      text: 'INSERT INTO project_comment(project_id, owner_id, comment) VALUES ($1, $2, $3) RETURNING *;',
      values: [projectId, ownerId, comment]
    })

    return data.rows[0]
  }

  async getProjectCommentById(commentId: string) {
    const data = await this.#pool.query<ProjectComment>({
      name: 'get_project_comment_by_id',
      text: 'SELECT 1 FROM project_comment WHERE id = $1;',
      values: [commentId]
    })
    return data.rows[0]
  }

  async getProjectComments(projectId: string) {
    const data = await this.#pool.query<ProjectComment>({
      name: 'get_project_comments',
      text: `
        SELECT u.name, pc.comment
        FROM app_user u
        JOIN project_comment pc ON u.id = pc.owner_id
        WHERE pc.project_id = $1;
      `,
      values: [projectId]
    })
    return data.rows
  }

  async updateProjectComment(commentId: string, newComment: string) {
    const data = await this.#pool.query<ProjectComment>({
      name: 'update_project_comment',
      text: 'UPDATE project_comment SET comment = $2 WHERE comment_id = $1 RETURNING *;',
      values: [commentId, newComment]
    })

    return data.rows[0]
  }

  async deleteProjectComment(commentId: string) {
    const data = await this.#pool.query({
      name: 'delete_project_comment',
      text: 'DELETE FROM project_comment WHERE id = $1;',
      values: [commentId]
    })

    return data.rowCount > 0
  }
}
