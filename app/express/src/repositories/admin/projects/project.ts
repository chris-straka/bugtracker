import { db } from '../../../config/postgres'

export async function adminChangeProjectOwner(projectId: string, newOwnerId: string): Promise<boolean> { 
  const res = await db.query({
    name: 'admin_change_project_owner',
    text: 'UPDATE project SET owner_id = $2 WHERE id = $1',
    values: [projectId, newOwnerId]
  })

  return res.rowCount > 0
}