import type { Pool } from 'pg'
import type { BaseUser } from '../../models/User'

export interface IProjectUserRepository {
  getProjectUsers(projectId: string): Promise<BaseUser[]>,
  checkIfUserIsAssignedToProject(projectId: string, userId: string): Promise<boolean>,
  addUserToProject(projectId: string, userId: string): Promise<boolean>,
  removeUserFromProject(projectId: string, userId: string): Promise<boolean>,
}

export class ProjectUserRepository implements IProjectUserRepository {
  #pool: Pool

  constructor(dbPool: Pool) {
    this.#pool = dbPool
  }

  async getProjectUsers(projectId: string) {
    const data = await this.#pool.query<BaseUser>({
      name: 'get_project_users',
      text: `
        SELECT u.id, u.username, u.email, u.role
        FROM project_user pu
        JOIN app_user u ON u.id = pu.user_id
        WHERE pu.project_id = $1;
      `,
      values: [projectId]
    })
    return data.rows
  }

  async checkIfUserIsAssignedToProject(projectId: string, userId: string) {
    const data = await this.#pool.query({
      name: 'check_if_user_is_assigned_to_project',
      text: `
        SELECT 1
        FROM project_user
        WHERE project_id = $1 AND user_id = $2;
      `,
      values: [userId, projectId]
    })
    return data.rowCount > 1
  }

  async addUserToProject(projectId: string, userId: string) {
    const res = await this.#pool.query({
      name: 'add_user_to_project',
      text: 'INSERT INTO project_user(project_id, user_id) VALUES ($1, $2);',
      values: [projectId, userId]
    })

    return res.rowCount > 0
  }

  async removeUserFromProject(projectId: string, userId: string) {
    const res = await this.#pool.query({
      name: 'add_user_to_project',
      text: 'DELETE FROM project_user WHERE project_id = $1 AND user_id = $2;',
      values: [projectId, userId]
    }) 

    return res.rowCount > 0
  }
}
