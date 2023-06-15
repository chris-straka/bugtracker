import { Router } from 'express'
import { body } from 'express-validator'
import { validateInput, isAuthenticated } from '../middleware'
import * as AuthController from '../controllers/auth'

const router = Router()

// login
router.post('/sessions',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5, max: 90 }).withMessage('Password must be between 5 and 90 characters')
  ],
  validateInput,
  AuthController.login
)

// logout
router.delete('/sessions',
  isAuthenticated,
  AuthController.logout
)

export default router
