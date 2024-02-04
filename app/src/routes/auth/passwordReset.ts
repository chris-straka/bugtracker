import { Router } from 'express'
import { body, param } from 'express-validator'
import { validateInput } from '../../middleware'
import * as PasswordResetController from '../../controllers/auth/passwordReset'

const router = Router()

// request change password
router.post('/password-reset-requests', 
  body('email', 'Email must be valid').isEmail(),
  validateInput,
  PasswordResetController.requestPasswordResetEmail
)

// change password
router.put('/passwords/:passwordResetToken', 
  [
    param('passwordResetToken', 'Invalid password reset token').isHexadecimal().isLength({ min: 40, max: 40 }),
    body('newPassword', 'You must type in a strong password that is at least 14 characters length').isStrongPassword({ 
      minLength: 14,
      minSymbols: 0
    }),
  ],
  validateInput,
  PasswordResetController.changePassword
)

export default router