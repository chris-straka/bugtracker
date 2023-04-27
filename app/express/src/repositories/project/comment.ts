import { db } from '../../config/postgres'

async function createProjectComment(description: string, ownerId: string, projectId: string) {
  const result = await db.query({
    name: 'create_project_comment',
    text: 'INSERT INTO project_comments(description, owner_id, project_id) VALUES ($1, $2, $3) RETURNING *;',
    values: [description, ownerId, projectId]
  })
  return result.rows[0]
}

export default {
  createProjectComment
}