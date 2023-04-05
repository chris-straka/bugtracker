import { Router } from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated'
import { 
  getProjectComments, createProjectComment, editProjectComment, 
  deleteProjectComment 
} from '../controllers/projectComments'

const router = Router()

router.get('/projects/:projectId/comments', isAuthenticated, getProjectComments)
router.post('/projects/:projectId/comments', isAuthenticated, createProjectComment)
router.put('/projects/:projectId/comments/:commentId', isAuthenticated, editProjectComment)
router.delete('/projects/:projectId/comments/:commentId', isAuthenticated, deleteProjectComment)

export default router