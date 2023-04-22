import { Router } from 'express'
import { body, oneOf } from 'express-validator'
import { isAuthenticated, isAuthorized, validateInput } from '../middleware'
import { changeUser } from '../controllers/admin'

const router = Router()

router.put('/admin/users/:userId',
  isAuthenticated,
  isAuthorized(['admin']),
  [
    body('email', 'Invalid email format').optional().isEmail(),
    body('username', 'Invalid username').optional().isString(),
    body('role', 'Invalid role').optional().isIn(['admin', 'project_manager', 'developer', 'contributor']),
    oneOf(
      [
        body('email').exists(),
        body('username').exists(),
        body('role').exists()
      ], 
      { message: 'You need to at least specify email, username, or password' }
    )
  ],
  validateInput,
  changeUser
)

export default router
