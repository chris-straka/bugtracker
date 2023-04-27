import { db } from '../../config/postgres'

async function addUserToProject(userId: string, projectId: string) {
  const result = await db.query({
    name: 'add_user_to_project',
    text: 'INSERT INTO project_user(user_id, project_id) VALUES ($1, $2);',
    values: [userId, projectId]
  })
  return result.rows[0]
}

export default {
  addUserToProject
}