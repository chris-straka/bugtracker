import { Router } from 'express'
import { body } from 'express-validator'
import { isAuthenticated, isAuthorized, validateInput } from '../middleware'
import { cursorPaginationValidators } from '../validators'
import { 
  changeUserUsername, changeUserEmail, deleteCurrentUser, getUserActivity,
  getUserAssignedProjects, getUserAssignedTickets,
  getUserCreatedTickets, getUserCreatedProjects,
} from '../controllers/me/me'

const router = Router()

router.get('/me/activity',
  isAuthenticated,
  getUserActivity
)

router.get('/me/my-tickets',
  isAuthenticated,
  getUserCreatedTickets
)

router.get('/me/my-projects',
  isAuthenticated,
  isAuthorized(['project_manager', 'admin']),
  getUserCreatedProjects 
)

router.get('/me/assigned-tickets',
  isAuthenticated,
  cursorPaginationValidators,
  validateInput,
  getUserAssignedTickets
)

router.get('/me/assigned-projects',
  isAuthenticated,
  cursorPaginationValidators,
  validateInput,
  getUserAssignedProjects
)

router.put('/me/email',
  isAuthenticated,
  [body('email', 'Email is not valid').isEmail()],
  validateInput,
  changeUserEmail
)

router.put('/me/username',
  isAuthenticated,
  [body('username', 'Username is not valid').isString()],
  validateInput,
  changeUserUsername
)

router.delete('/me',
  isAuthenticated,
  deleteCurrentUser
)

export default router