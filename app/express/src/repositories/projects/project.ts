import { db } from '../../config/postgres'
import { Project } from '../../models/Project'
import { ProjectStatus } from '../../types'

async function createProject(ownerId: string, name: string, description: string): Promise<Project> {
  try {
    await db.query('BEGIN;')

    // create the project
    const res = await db.query({
      name: 'create_project',
      text: 'INSERT INTO projects(owner_id, name, description) VALUES ($1, $2, $3) RETURNING *;',
      values: [ownerId, name, description],
    })

    const project = res.rows[0]

    // assign the project creator to the list of project users
    await db.query({
      name: 'add_owner_to_project',
      text: 'INSERT INTO project_user(user_id, project_id) VALUES ($1, $2);',
      values: [ownerId, project.id],
    })

    await db.query('COMMIT;')

    return project
  } catch (error) {
    await db.query('ROLLBACK;')
    throw error
  } 
}

async function getProjectById(projectId: string): Promise<Project> {
  const data = await db.query({
    name: 'get_project_by_id',
    text: 'SELECT * FROM project WHERE id = $1;',
    values: [projectId]
  })
  return data.rows[0]
}

async function getProjectByName(name: string): Promise<Project> {
  const data = await db.query({
    name: 'get_project_by_id',
    text: 'SELECT * FROM project WHERE name = $1;',
    values: [name]
  })
  return data.rows[0]
}

async function getUserAssignedProjects(userId: string, cursor = '0', limit = '10'): Promise<Project[]> {
  const data = await db.query({
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

async function getUserCreatedProjects(userId: string, cursor = '0', limit = '10'): Promise<Project[]> {
  const data = await db.query({
    name: 'get_user_created_projects',
    text: `
      SELECT p.* 
      FROM user u
      JOIN project p ON u.id = p.owner_id
      WHERE u.id = $1 AND p.id > $2
      ORDER BY p.id ASC
      LIMIT $3;
    `,
    values: [userId, cursor, limit]
  })
  return data.rows
}

async function updateProject(projectId: string, name?: string, description?: string, status?: ProjectStatus) {
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

  const result = await db.query({
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

async function deleteProject(projectId: string): Promise<boolean> {
  const data = await db.query({
    name: 'delete_project',
    text: 'DELETE FROM project WHERE id = $1;',
    values: [projectId]
  })
  return data.rowCount > 0
}

export default {
  createProject, getProjectById, getProjectByName, 
  getUserAssignedProjects, getUserCreatedProjects, 
  updateProject, deleteProject
}
