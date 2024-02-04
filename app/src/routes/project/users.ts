import { Router } from 'express'
import { body, param } from 'express-validator'
import { isActive, isAuthenticated, isAuthorized, validateInput, isProjectMemberOrAdmin, projectExists, userExists } from '../../middleware'
import * as ProjectUserController from '../../controllers/project'

const router = Router()

// project users
router.get('/projects/:projectId/users',
  isAuthenticated, 
  isActive,
  param('projectId').isInt().withMessage('Project ID must be an integer'),
  validateInput,
  isProjectMemberOrAdmin,
  ProjectUserController.getProjectUsers
)

router.post('/projects/:projectId/users', 
  isAuthenticated, 
  isActive,
  isAuthorized(['project_manager', 'admin']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  projectExists,
  isProjectMemberOrAdmin,
  ProjectUserController.addProjectUser
)

// remove a user from a project
router.delete('/projects/:projectId/users/:userId', 
  isAuthenticated, 
  isActive,
  isAuthorized(['project_manager', 'admin']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  projectExists,
  userExists,
  isProjectMemberOrAdmin,
  ProjectUserController.removeProjectUser
)

export default router
