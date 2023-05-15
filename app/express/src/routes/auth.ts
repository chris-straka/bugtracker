import { Router } from 'express'
import { body, param } from 'express-validator'
import { validateInput, isAuthenticated } from '../middleware'
import { login, logout, forgetPassword, resetPassword, createUser } from '../controllers/auth/auth'

const router = Router()

// login
router.post('/sessions',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5, max: 90 }).withMessage('Password must be between 5 and 90 characters')
  ],
  validateInput,
  login
)

// logout
router.delete('/sessions',
  isAuthenticated,
  logout
)

// signup
router.post('/users', 
  [
    body('username', 'Username is required').notEmpty().isString(),
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must be 5 to 90 chars').isLength({ min: 5, max: 90 }),
  ],
  validateInput,
  createUser
)

router.post('/passwords', 
  body('email', 'Email must be valid').isEmail(),
  validateInput,
  forgetPassword
)

router.put('/passwords/:passwordResetToken', 
  param('passwordResetToken', 'Invalid password reset token').isHexadecimal().isLength({ min: 40, max: 40 }),
  body('newPassword', 'Password must be 5 to 90 chars').isLength({ min: 5, max: 90 }),
  validateInput,
  resetPassword
)

export default router
