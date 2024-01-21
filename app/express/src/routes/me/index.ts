import { Router } from 'express'
import { body } from 'express-validator'
import { isAuthenticated, isAuthorized, isActive, validateInput } from '../../middleware'
import { cursorPaginationValidators } from '../../validators'
import * as MeController from '../../controllers/me'

const router = Router()

router.get('/me/activity',
  isAuthenticated,
  isActive,
  MeController.getUserActivity
)

router.get('/me/my-tickets',
  isAuthenticated,
  isActive,
  MeController.getUserCreatedTickets
)

router.get('/me/assigned-tickets',
  isAuthenticated,
  isActive,
  cursorPaginationValidators,
  validateInput,
  MeController.getUserAssignedTickets
)

router.get('/me/my-projects',
  isAuthenticated,
  isActive,
  isAuthorized(['project_manager', 'admin', 'owner']),
  MeController.getUserCreatedProjects 
)

router.get('/me/assigned-projects',
  isAuthenticated,
  isActive,
  cursorPaginationValidators,
  validateInput,
  MeController.getUserAssignedProjects
)

router.put('/me/username',
  isAuthenticated,
  isActive,
  body('newUsername', 'Username is not valid').isString(),
  validateInput,
  MeController.changeUserUsername
)

router.post('/me/email-reset-requests', 
  isAuthenticated,
  isActive,
  body('newEmail', 'New email is not valid').isEmail(),
  validateInput,
  MeController.requestEmailReset
)

router.delete('/me',
  isAuthenticated,
  isActive,
  MeController.deleteCurrentUser
)

export default router
