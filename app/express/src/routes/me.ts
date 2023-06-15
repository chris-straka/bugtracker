import { Router } from 'express'
import { body } from 'express-validator'
import { isAuthenticated, isAuthorized, validateInput } from '../middleware'
import { cursorPaginationValidators } from '../validators'
import * as MeController from '../controllers/me'

const router = Router()

router.get('/me/activity',
  isAuthenticated,
  MeController.getUserActivity
)

router.get('/me/my-tickets',
  isAuthenticated,
  MeController.getUserCreatedTickets
)

router.get('/me/assigned-tickets',
  isAuthenticated,
  cursorPaginationValidators,
  validateInput,
  MeController.getUserAssignedTickets
)

router.get('/me/my-projects',
  isAuthenticated,
  isAuthorized(['project_manager', 'admin', 'owner']),
  MeController.getUserCreatedProjects 
)

router.get('/me/assigned-projects',
  isAuthenticated,
  cursorPaginationValidators,
  validateInput,
  MeController.getUserAssignedProjects
)

router.put('/me/username',
  isAuthenticated,
  body('newUsername', 'Username is not valid').isString(),
  validateInput,
  MeController.changeUserUsername
)

router.post('/me/email-reset-requests', 
  isAuthenticated,
  body('newEmail', 'New email is not valid').isEmail(),
  validateInput,
  MeController.requestEmailReset
)

router.delete('/me',
  isAuthenticated,
  MeController.deleteCurrentUser
)

export default router
