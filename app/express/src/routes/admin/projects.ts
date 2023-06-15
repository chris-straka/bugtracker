import { Router } from 'express'
import { param } from 'express-validator'
import { searchPaginationValidators } from '../../validators'
import { isAuthenticated, isAuthorized, validateInput } from '../../middleware'
import * as AdminProjectController from '../../controllers/admin/project'

const router = Router()

router.get('/admin/projects',
  isAuthenticated,
  isAuthorized(['admin', 'owner']),
  searchPaginationValidators,
  validateInput,
  AdminProjectController.searchAllProjects
)

router.put('/admin/projects/:projectId/owner', 
  isAuthenticated,
  isAuthorized(['admin', 'owner']),
  param('projectId').isInt().withMessage('Project ID must be an integer'),
  validateInput, 
  AdminProjectController.changeProjectOwner
)

export default router