import type { Pool } from 'pg'
import type { Project, ProjectStatus } from '../../models/Project'

export interface IProjectRepository {
  createProject(ownerId: string, name: string, description: string): Promise<Project>,
  getProjectBy(field: 'id' | 'name', value: string): Promise<Project>,
  getUserAssignedProjects(userId: string, cursor?: string, limit?: string): Promise<Project[]>,
  getUserCreatedProjects(userId: string, cursor?: string, limit?: string): Promise<Project[]>,
  searchAllProjects(search: string, cursor?: string, limit?: string): Promise<Project[]>,
  updateProject(projectId: string, name?: string, description?: string, status?: ProjectStatus): Promise<Project>,
  changeProjectOwner(projectId: string, newOwnerId: string): Promise<boolean>,
  deleteProject(projectId: string): Promise<boolean>,
}

export class ProjectRepository implements IProjectRepository {
  #pool: Pool

  constructor(dbPool: Pool) {
    this.#pool = dbPool
  }

  async createProject(ownerId: string, name: string, description: string) {
    const client = await this.#pool.connect()

    try {
      await client.query('BEGIN;')

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

      await client.query('COMMIT;')

      return project
    } catch (error) {
      await client.query('ROLLBACK;')
      throw error
    } finally {
      client.release()
    }
  }

  async getProjectBy(field: 'id' | 'name', value: string) {
    let query: string

    switch (field) {
      case 'id':
        query = 'SELECT * FROM project WHERE id = $1;'
        break
      case 'name':
        query = 'SELECT * FROM project WHERE name = $1;'
        break
      default:
        throw new Error('Invalid field')
    }

    const result = await this.#pool.query<Project>({
      name: 'get_ticket_by',
      text: query,
      values: [value],
    })
    return result.rows[0]
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
      values: [userId, cursor, limit]
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
      values: [userId, cursor, limit]
    })
    return data.rows
  }

  async searchAllProjects(search: string, cursor = '0', limit = '10') {
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
      values: [search, cursor, limit]
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
    const res = await this.#pool.query({
      name: 'admin_change_project_owner',
      text: 'UPDATE project SET owner_id = $2 WHERE id = $1',
      values: [projectId, newOwnerId]
    })

    return res.rowCount > 0
  }

  async deleteProject(projectId: string) {
    const data = await this.#pool.query({
      name: 'delete_project',
      text: 'DELETE FROM project WHERE id = $1;',
      values: [projectId]
    })
    return data.rowCount > 0
  }
}