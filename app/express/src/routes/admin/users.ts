import { Router } from 'express'
import { param, body } from 'express-validator'
import { isAuthenticated, isAuthorized, validateInput } from '../../middleware'
import { UserRolesArray, UserAccountStatusTypeArray } from '../../models/User'
import * as AdminUserController from '../../controllers/admin/user'

const router = Router()

router.put('/admin/users/:userId/role',
  isAuthenticated,
  isAuthorized(['admin', 'owner']),
  [ 
    param('userId').isInt().withMessage('User ID must be an integer'),
    body('role', 'Invalid role').isIn(UserRolesArray),
  ],
  validateInput, 
  AdminUserController.changeUserRole
)

router.put('/admin/users/:userId/account-status',
  isAuthenticated,
  isAuthorized(['admin', 'owner']),
  [ 
    param('userId').isInt().withMessage('User ID must be an integer'),
    body('status', 'Invalid status').isIn(UserAccountStatusTypeArray),
  ],
  validateInput, 
  AdminUserController.changeUserRole
)

router.delete('/admin/users/:userId',
  isAuthenticated,
  isAuthorized(['admin', 'owner']),
  param('userId').isInt().withMessage('User ID must be an integer'),
  validateInput, 
  AdminUserController.deleteUser
)

export default router
