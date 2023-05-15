import { Router } from 'express'
import { body, oneOf, param } from 'express-validator'
import { isAuthenticated, isAuthorized, validateInput } from '../middleware'
import { RolesArr } from '../types'
import { 
  adminSearchProjects, changeProjectOwner, 
  changeUser, deleteUser, adminSearchTickets
} from '../controllers/admin'

const router = Router()

router.put('/admin/users/:userId',
  isAuthenticated,
  isAuthorized(['admin', 'owner']),
  [
    param('userId').isInt().withMessage('User ID must be an integer'),
    body('email', 'Invalid email format').optional().isEmail(),
    body('username', 'Invalid username').optional().isString(),
    body('newRole', 'Invalid role').optional().isIn(RolesArr),
    oneOf(
      [
        body('email').exists(),
        body('username').exists(),
        body('newRole').exists()
      ], 
      { message: 'You need to specify something either an email, username, or password' }
    )
  ],
  validateInput,
  changeUser
)

router.delete('/admin/users/:userId',
  isAuthenticated,
  isAuthorized(['admin', 'owner']),
  [param('userId').isInt().withMessage('User ID must be an integer')],
  validateInput, 
  deleteUser
)

router.put('/admin/projects/:projectId/owner', 
  isAuthenticated,
  isAuthorized(['admin', 'owner']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),

  ],
  validateInput, 
  changeProjectOwner
)

router.get('/admin/projects',
  isAuthenticated,
  adminSearchProjects
)
router.get('/admin/tickets',
  isAuthenticated,
  adminSearchTickets
)

export default router
