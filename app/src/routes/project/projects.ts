import { Router } from 'express'
import { body, oneOf, param } from 'express-validator'
import { ProjectStatusArray } from '../../models/Project'
import { projectExists, isActive, isAuthenticated, isAuthorized, isProjectMemberOrAdmin, validateInput } from '../../middleware'
import * as ProjectController from '../../controllers/project'
import { isProjectOwnerOrAdmin } from '../../middleware/isProjectOwnerOrAdmin'

const router = Router()

router.post('/projects',
  isAuthenticated,
  isActive,
  isAuthorized(['project_manager', 'admin']),
  [
    body('name').isString().trim().isLength({ min: 4, max: 100 }).withMessage('Name must be string between 4 and 100 characters'),
    body('description').isString().trim().isLength({ min: 0, max: 500 }).withMessage('Description must be between 0 and 500 characters')
  ],
  validateInput,
  ProjectController.createProject
)

router.get('/projects/:projectId', 
  isAuthenticated, 
  isActive,
  param('projectId').isInt().withMessage('Project ID must be an integer'),
  validateInput,
  ProjectController.getProject
)

router.put('/projects/:projectId', 
  isAuthenticated, 
  isActive,
  isAuthorized(['project_manager', 'admin', 'owner']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('name').optional().isString().isLength({ min: 5, max: 100 }).withMessage('Name must be string between 5 and 100 characters'),
    body('description').optional().isLength({ min: 0, max: 500 }).withMessage('Description must be between 0 and 500 characters'),
    body('status').optional().isIn(ProjectStatusArray),
    oneOf(
      [
        body('name').exists(),
        body('description').exists(),
        body('status').exists()
      ], 
      { message: 'You need to specify either a new name, description, or status' }
    )
  ],
  validateInput,
  projectExists,
  isProjectMemberOrAdmin,
  ProjectController.updateProject
)

router.delete('/projects/:projectId', 
  isAuthenticated, 
  isActive,
  projectExists,
  isProjectOwnerOrAdmin,
  isAuthorized(['project_manager', 'admin']),
  param('projectId').isInt().withMessage('Project ID must be an integer'),
  validateInput,
  ProjectController.deleteProject
)

export default router
