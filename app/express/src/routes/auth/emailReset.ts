import { Router } from 'express'
import { param } from 'express-validator'
import { validateInput } from '../../middleware'
import * as EmailResetController from '../../controllers/auth/emailReset'

const router = Router()

router.put('/emails/:emailResetToken', 
  param('emailResetToken', 'Invalid email reset token').isHexadecimal().isLength({ min: 40, max: 40 }),
  validateInput,
  EmailResetController.changeEmailViaResetToken
)

export default router
