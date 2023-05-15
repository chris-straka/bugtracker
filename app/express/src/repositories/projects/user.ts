import { db } from '../../config/postgres'
import { User } from '../../models/User'

async function getProjectUsers(projectId: string): Promise<User[]> {
  const data = await db.query({
    name: 'get_project_users',
    text: `
      SELECT u.*
      FROM project_user pu
      JOIN user u ON u.id = pu.user_id 
      WHERE pu.project_id = $1;
    `,
    values: [projectId]
  })
  return data.rows
}

async function addUserToProject(projectId: string, userId: string): Promise<boolean> {
  const res = await db.query({
    name: 'add_user_to_project',
    text: 'INSERT INTO project_user(project_id, user_id) VALUES ($1, $2);',
    values: [projectId, userId]
  }) 

  return res.rowCount > 0
}

async function removeUserFromProject(projectId: string, userId: string): Promise<boolean> {
  const res = await db.query({
    name: 'add_user_to_project',
    text: 'DELETE FROM project_user WHERE project_id = $1 AND user_id = $2;',
    values: [projectId, userId]
  }) 

  return res.rowCount > 0
}

async function checkIfUserIsAssignedToProject(projectId: string, userId: string): Promise<boolean> {
  const data = await db.query({
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

export default {
  getProjectUsers,
  addUserToProject,
  removeUserFromProject,
  checkIfUserIsAssignedToProject
}