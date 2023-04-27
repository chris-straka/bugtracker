import { db } from '../../config/postgres'
import { Project } from '../../models/Project'

async function createProject(name: string, description: string, ownerId: string): Promise<Project> {
  const data = await db.query({
    name: 'create_project',
    text: 'INSERT INTO projects(name, description, owner_id) VALUES ($1, $2, $3) RETURNING *;',
    values: [name, description, ownerId]
  })
  return data.rows[0]
}

async function getProject(id: string): Promise<Project> {
  const data = await db.query({
    name: 'get_project',
    text: 'SELECT * FROM project WHERE id = $1;',
    values: [id]
  })
  return data.rows[0]
}

async function checkIfProjectExistsByName(name: string): Promise<boolean> {
  const data = await db.query({
    name: 'check_if_project_exists_by_name',
    text: 'SELECT 1 FROM project WHERE name = $1;',
    values: [name]
  })
  return data.rowCount > 0
}

async function updateProject(id: string, name?: string, description?: string) {
  const fields = []
  const values = []

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

  if (fields.length === 0) throw new Error('Nothing was specified')

  const result = await db.query({
    name: 'update_project',
    text: `UPDATE project SET ${fields.join(', ')} WHERE id = $1 RETURNING name, description;`,
    values: [id, ...values],
  })

  return result.rows[0]
}

async function deleteProject(id: string): Promise<boolean> {
  const data = await db.query({
    name: 'delete_project',
    text: 'DELETE FROM project_comments WHERE id = $1;',
    values: [id]
  })
  return data.rowCount > 0
}

export default {
  createProject,
  getProject,
  checkIfProjectExistsByName,
  deleteProject,
  updateProject,
}