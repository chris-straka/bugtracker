import { Router } from 'express'
import { body, param } from 'express-validator'
import { validateInput } from '../middleware'
import { forgetPassword, resetPassword } from '../controllers/password'

const router = Router()

router.post('/passwords', 
  body('email', 'Email must be valid').isEmail(),
  validateInput,
  forgetPassword
)

router.put(
  '/passwords/:passwordResetToken', 
  param('passwordResetToken', 'Invalid password reset token').isHexadecimal().isLength({ min: 40, max: 40 }),
  body('newPassword', 'Password must be 5 to 90 chars').isLength({ min: 5, max: 90 }),
  validateInput,
  resetPassword
)

export default router