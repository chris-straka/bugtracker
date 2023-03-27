import { Router } from 'express'
import { body } from 'express-validator'
import { loginUser, logoutUser, signupUser, forgetPassword, resetPassword } from '../controllers/auth'
import { isAuthenticated, validateInput } from '../middleware'

const router = Router()

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5, max: 90 }).withMessage('Password must be between 5 and 90 characters')
  ],
  validateInput,
  loginUser
)

router.post('/logout', isAuthenticated, logoutUser)
router.post('/signup', signupUser)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)

export default router
