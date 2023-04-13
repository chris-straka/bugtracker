import { Router } from 'express'
import { body } from 'express-validator'
import { isAuthenticated, validateInput } from '../middleware/index'
import { login, logout } from '../controllers/sessions'

const router = Router()

// login
router.post(
  '/sessions',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5, max: 90 }).withMessage('Password must be between 5 and 90 characters')
  ],
  validateInput,
  login
)

// logout
router.delete(
  '/sessions',
  isAuthenticated,
  logout
)

export default router
