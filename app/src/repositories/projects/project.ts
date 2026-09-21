import type { Pool } from 'pg'
import type { Project, ProjectStatus } from '../../models/Project'
import { execute, queryExists } from '../../db/query'
import { withTransaction } from '../../db/transaction'

export interface IProjectRepository {
  createProject(ownerId: string, name: string, description: string): Promise<Project>

  projectExistsById(projectId: string): Promise<boolean>
  getProjectById(projectId: string): Promise<Project>
  getProjectByName(name: string): Promise<Project>
  getProjectOwnerId(projectId: string): Promise<number>
  getUserAssignedProjects(userId: string, cursor?: string, limit?: string): Promise<Project[]>
  getUserCreatedProjects(userId: string, cursor?: string, limit?: string): Promise<Project[]>
  searchAllProjects(search?: string, cursor?: string, limit?: string): Promise<Project[]>

  updateProject(
    projectId: string,
    name?: string,
    description?: string,
    status?: ProjectStatus,
  ): Promise<Project>
  changeProjectOwner(projectId: string, newOwnerId: string): Promise<boolean>

  deleteProject(projectId: string): Promise<boolean>
}

export class ProjectRepository implements IProjectRepository {
  #pool: Pool

  constructor(dbPool: Pool) {
    this.#pool = dbPool
  }

  async createProject(ownerId: string, name: string, description: string) {
    return withTransaction(this.#pool, async (client) => {
      // create the project
      const res = await client.query<Project>({
        name: 'create_project',
        text: 'INSERT INTO project(owner_id, name, description) VALUES ($1, $2, $3) RETURNING *;',
        values: [ownerId, name, description],
      })

      const project = res.rows[0]

      // assign the project creator to the list of project users
      await client.query({
        name: 'add_project_owner_to_project',
        text: 'INSERT INTO project_user(user_id, project_id) VALUES ($1, $2);',
        values: [ownerId, project.id],
      })

      return project
    })
  }

  async projectExistsById(projectId: string) {
    return queryExists(this.#pool, {
      name: 'project_exists',
      text: 'SELECT 1 FROM project WHERE id = $1;',
      values: [projectId],
    })
  }

  async getProjectById(id: string) {
    const result = await this.#pool.query<Project>({
      name: 'get_project_by_id',
      text: 'SELECT * FROM project WHERE id = $1;',
      values: [id],
    })

    return result.rows[0]
  }

  async getProjectByName(name: string) {
    const result = await this.#pool.query<Project>({
      name: 'get_project_by_name',
      text: 'SELECT * FROM project WHERE name = $1;',
      values: [name],
    })

    return result.rows[0]
  }

  async getProjectOwnerId(projectId: string) {
    const data = await this.#pool.query<{ owner_id: number }>({
      name: 'get_project_owner_id',
      text: 'SELECT owner_id FROM project WHERE id = $1;',
      values: [projectId],
    })

    return data.rows[0].owner_id
  }

  async getUserAssignedProjects(userId: string, cursor = '0', limit = '10') {
    const data = await this.#pool.query<Project>({
      name: 'get_user_assigned_projects',
      text: `
        SELECT p.* 
        FROM project_user pu
        JOIN project p ON p.id = pu.project_id
        WHERE pu.user_id = $1 AND p.id > $2
        ORDER BY p.id ASC
        LIMIT $3;
      `,
      values: [userId, cursor, limit],
    })
    return data.rows
  }

  async getUserCreatedProjects(userId: string, cursor = '0', limit = '10') {
    const data = await this.#pool.query<Project>({
      name: 'get_user_created_projects',
      text: `
        SELECT p.* 
        FROM app_user u
        JOIN project p ON u.id = p.owner_id
        WHERE u.id = $1 AND p.id > $2
        ORDER BY p.id ASC
        LIMIT $3;
      `,
      values: [userId, cursor, limit],
    })
    return data.rows
  }

  async searchAllProjects(search?: string, cursor = '0', limit = '10') {
    // No search term: list everything with plain cursor pagination.
    if (!search) {
      const data = await this.#pool.query<Project>({
        name: 'list_all_projects',
        text: `
          SELECT *
          FROM project
          WHERE id > $1
          ORDER BY id ASC
          LIMIT $2;
        `,
        values: [cursor, limit],
      })
      return data.rows
    }

    const data = await this.#pool.query<Project>({
      name: 'search_all_projects',
      text: `
        SELECT *, ts_rank(project_search_tsv, plainto_tsquery($1)) AS rank
        FROM project
        WHERE project_search_tsv @@ plainto_tsquery($1)
        AND id > $2
        ORDER BY rank DESC, id ASC
        LIMIT $3;
      `,
      values: [search, cursor, limit],
    })
    return data.rows
  }

  async updateProject(projectId: string, name?: string, description?: string, status?: ProjectStatus) {
    const fields = []
    const values = []

    // projectId is $1
    let counter = 2

    if (name !== undefined) {
      fields.push(`name = $${counter}`)
      values.push(name)
      counter++
    }

    if (description !== undefined) {
      fields.push(`description = $${counter}`)
      values.push(description)
      counter++
    }

    if (status !== undefined) {
      fields.push(`status = $${counter}`)
      values.push(status)
      counter++
    }

    if (fields.length === 0) throw new Error('Nothing was specified')

    const result = await this.#pool.query<Project>({
      name: 'update_project',
      text: `
        UPDATE project 
        SET ${fields.join(', ')} 
        WHERE id = $1 
        RETURNING name, description, status;
      `,
      values: [projectId, ...values],
    })

    return result.rows[0]
  }

  async changeProjectOwner(projectId: string, newOwnerId: string) {
    return execute(this.#pool, {
      name: 'admin_change_project_owner',
      text: 'UPDATE project SET owner_id = $2 WHERE id = $1',
      values: [projectId, newOwnerId],
    })
  }

  /**
   * Deletes a project and every row that references it (tickets and their
   * links/comments/history, project comments/members/history) in one
   * transaction. A plain `DELETE FROM project` fails on the foreign keys
   * that have no ON DELETE CASCADE, and deleting piecemeal without a
   * transaction could leave orphans.
   */
  async deleteProject(projectId: string) {
    return withTransaction(this.#pool, async (client) => {
      await client.query({
        name: 'delete_project_ticket_history',
        text: 'DELETE FROM ticket_history WHERE ticket_id IN (SELECT id FROM ticket WHERE project_id = $1);',
        values: [projectId],
      })
      await client.query({
        name: 'delete_project_ticket_comments',
        text: 'DELETE FROM ticket_comment WHERE ticket_id IN (SELECT id FROM ticket WHERE project_id = $1);',
        values: [projectId],
      })
      await client.query({
        name: 'delete_project_ticket_users',
        text: 'DELETE FROM ticket_user WHERE ticket_id IN (SELECT id FROM ticket WHERE project_id = $1);',
        values: [projectId],
      })
      await client.query({
        name: 'delete_project_tickets',
        text: 'DELETE FROM ticket WHERE project_id = $1;',
        values: [projectId],
      })
      await client.query({
        name: 'delete_project_comments',
        text: 'DELETE FROM project_comment WHERE project_id = $1;',
        values: [projectId],
      })
      await client.query({
        name: 'delete_project_users',
        text: 'DELETE FROM project_user WHERE project_id = $1;',
        values: [projectId],
      })
      await client.query({
        name: 'delete_project_history',
        text: 'DELETE FROM project_history WHERE project_id = $1;',
        values: [projectId],
      })
      return execute(client, {
        name: 'delete_project',
        text: 'DELETE FROM project WHERE id = $1;',
        values: [projectId],
      })
    })
  }
}
