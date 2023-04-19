import { Router } from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated'
import { 
  getProjects, getProject, createProject, editProject, deleteProject, addUserToProject, removeUserFromProject, 
  getProjectComments, createProjectComment, editProjectComment, deleteProjectComment 
} from '../controllers/projects'

const router = Router()

router.get('/projects', 
  isAuthenticated, 
  getProjects
)

router.get('/projects/:projectId', 
  isAuthenticated, 
  getProject
)

router.post('/projects/:projectId', 
  isAuthenticated, 
  createProject
)

router.put('/projects/:projectId', 
  isAuthenticated, 
  editProject
)

router.delete('/projects/:projectId', 
  isAuthenticated, 
  deleteProject
)

router.put('/projects/:projectId/users/:userId', 
  isAuthenticated, 
  addUserToProject
)

router.delete('/projects/:projectId/users/:userId', 
  isAuthenticated, 
  removeUserFromProject
)


/** 
 * Project comments
 */
router.get('/projects/:projectId/comments', 
  isAuthenticated, 
  getProjectComments
)

router.post('/projects/:projectId/comments', 
  isAuthenticated,
  createProjectComment
)

router.put('/projects/:projectId/comments/:commentId', 
  isAuthenticated, 
  editProjectComment
)

router.delete('/projects/:projectId/comments/:commentId', 
  isAuthenticated, 
  deleteProjectComment
)

export default router
