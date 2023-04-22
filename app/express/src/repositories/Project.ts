import { db } from '../config/postgres'

async function createProject(name: string, description: string, owner_id: string) {
  const data = await db.query({
    name: 'create_project',
    text: 'INSERT INTO projects(name, description, owner_id) VALUES ($1, $2, $3) RETURNING *;',
    values: [name, description, owner_id]
  })
  return data.rows[0]
}

async function createProjectComment(description: string, owner_id: string, project_id: string) {
  const result = await db.query({
    name: 'create_project_comment',
    text: 'INSERT INTO project_comments(description, owner_id, project_id) VALUES ($1, $2, $3) RETURNING *;',
    values: [description, owner_id, project_id]
  })
  return result.rows[0]
}

async function deleteProject(id: string) {
  const data = await db.query({
    name: 'delete_project',
    text: 'DELETE FROM project_comments WHERE id = $1;',
    values: [id]
  })
  return data.rowCount > 0
}

async function editProject(id: string, name?: string, description?: string) {
  console.log(id)
  console.log(name)
  console.log(description)
}

export default {
  createProject,
  createProjectComment,
  deleteProject,
  editProject
}