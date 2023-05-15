import { db } from '../../config/postgres'
import { ProjectComment } from '../../models/Project'

async function createProjectComment(
  projectId: string, 
  ownerId: string, 
  comment: string
): Promise<ProjectComment> {
  const data = await db.query({
    name: 'create_project_comment',
    text: 'INSERT INTO project_comment(project_id, owner_id, comment) VALUES ($1, $2, $3) RETURNING *;',
    values: [projectId, ownerId, comment]
  })

  return data.rows[0]
}

async function getProjectCommentById(commentId: string): Promise<ProjectComment> {
  const data = await db.query({
    name: 'get_project_comment_by_id',
    text: 'SELECT 1 FROM project_comment WHERE id = $1;',
    values: [commentId]
  })
  return data.rows[0]
}

async function getProjectComments(projectId: string): Promise<ProjectComment[]> {
  const data = await db.query({
    name: 'get_project_comments',
    text: `
      SELECT user.name, pc.comment
      FROM user
      JOIN project_comment pc ON user.id = pc.owner_id
      WHERE pc.project_id = $1;
    `,
    values: [projectId]
  })
  return data.rows
}

async function updateProjectComment(commentId: string, newComment: string): Promise<boolean> {
  const data = await db.query({
    name: 'update_project_comment',
    text: 'UPDATE project_comment SET comment = $2 WHERE comment_id = $1;',
    values: [commentId, newComment]
  })

  return data.rowCount > 0
}

async function deleteProjectComment(commentId: string): Promise<boolean> {
  const data = await db.query({
    name: 'delete_project_comment',
    text: 'DELETE FROM project_comment WHERE id = $1;',
    values: [commentId]
  })

  return data.rowCount > 0
}

export default {
  createProjectComment,
  getProjectCommentById,
  getProjectComments,
  updateProjectComment,
  deleteProjectComment
}