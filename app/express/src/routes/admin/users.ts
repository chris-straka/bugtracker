import { Router } from 'express'
import { param, body } from 'express-validator'
import type { UserRole } from '../../models/User'
import { isActive, isAuthenticated, isAuthorized, validateInput } from '../../middleware'
import { UserRolesArray, UserAccountStatusArray } from '../../models/User'
import * as AdminUserController from '../../controllers/admin/user'

const router = Router()

router.put('/admin/users/:userId/role',
  isAuthenticated,
  isActive,
  isAuthorized(['admin', 'owner'] as UserRole[]),
  [ 
    param('userId').isInt().withMessage('User ID must be an integer'),
    body('newRole', 'Invalid role').isIn(UserRolesArray),
  ],
  validateInput, 
  AdminUserController.changeUserRole
)

router.put('/admin/users/:userId/account-status',
  isAuthenticated,
  isActive,
  isAuthorized(['admin', 'owner'] as UserRole[]),
  [ 
    param('userId').isInt().withMessage('User ID must be an integer'),
    body('newAccountStatus', 'Invalid account status status').isIn(UserAccountStatusArray),
  ],
  validateInput, 
  AdminUserController.changeAccountStatus
)

router.delete('/admin/users/:userId',
  isAuthenticated,
  isActive,
  isAuthorized(['admin', 'owner'] as UserRole[]),
  param('userId').isInt().withMessage('User ID must be an integer'),
  validateInput, 
  AdminUserController.deleteUser
)

export default router
