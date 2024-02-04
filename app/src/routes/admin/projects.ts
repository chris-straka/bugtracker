import { Router } from 'express'
import { param } from 'express-validator'
import { isActive, isAuthenticated, isAuthorized, validateInput } from '../../middleware'
import { searchPaginationValidators } from '../../validators'
import * as AdminProjectController from '../../controllers/admin/project'

const router = Router()

router.get('/admin/projects',
  isAuthenticated,
  isActive,
  isAuthorized(['admin', 'owner']),
  searchPaginationValidators,
  validateInput,
  AdminProjectController.searchAllProjects
)

router.put('/admin/projects/:projectId/owner', 
  isAuthenticated,
  isActive,
  isAuthorized(['admin', 'owner']),
  param('projectId').isInt().withMessage('Project ID must be an integer'),
  validateInput, 
  AdminProjectController.changeProjectOwner
)

export default router