import { Router } from 'express'
import { param } from 'express-validator'
import { validateInput } from '../middleware'
import * as EmailController from '../controllers/email'

const router = Router()

router.put('/emails/:emailResetToken', 
  param('emailResetToken', 'Invalid email reset token').isHexadecimal().isLength({ min: 40, max: 40 }),
  validateInput,
  EmailController.changeEmailViaResetToken
)

export default router
