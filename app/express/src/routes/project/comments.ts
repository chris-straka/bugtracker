import { Router } from 'express'
import { param, body } from 'express-validator'
import { validateInput, isAuthenticated, isProjectMemberOrAdmin } from '../../middleware'
import * as ProjectCommentController from '../../controllers/project'

const router = Router()

// project comments
router.get('/projects/:projectId/comments', 
  isAuthenticated, 
  param('projectId').isInt().withMessage('Project ID must be an integer'),
  validateInput,
  isProjectMemberOrAdmin,
  ProjectCommentController.getProjectComments
)

router.post('/projects/:projectId/comments', 
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('comment').isString().isLength({ min: 1, max: 500 }).withMessage('Project comment must be a string of 1-500 characters')
  ],
  validateInput,
  isProjectMemberOrAdmin,
  ProjectCommentController.createProjectComment
)

router.put('/projects/:projectId/comments/:commentId', 
  isAuthenticated, 
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('commentId').isInt().withMessage('Comment ID must be an integer'),
    body('comment').isString().isLength({ min: 1, max: 500 }).withMessage('Project comment must be a string of 1-500 characters')
  ],
  validateInput,
  isProjectMemberOrAdmin,
  ProjectCommentController.updateProjectComment
)

router.delete('/projects/:projectId/comments/:commentId', 
  isAuthenticated, 
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('commentId').isInt().withMessage('Comment ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  ProjectCommentController.deleteProjectComment
)

export default router