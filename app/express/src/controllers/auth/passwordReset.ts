import type { Request, Response, NextFunction } from 'express'
import { userService, emailService, passwordResetService } from '../../services'
import { createResetToken } from '../../utility'

// POST /password-reset-requests
export async function requestPasswordResetEmail(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body

  try {
    const user = await userService.getUserByEmail(email)

    if (user) {
      const passwordResetToken = createResetToken()
      await passwordResetService.storePasswordResetTokenUnderUserId(passwordResetToken, user.id.toString())

      const passwordResetTemplate = await emailService.getPasswordResetTemplate()
      const passwordResetTemplateWithToken = await emailService.embedTokenInEmailTemplate(passwordResetToken, passwordResetTemplate)
      await emailService.sendEmail(user.email, 'Bugtracker: Password Reset', passwordResetTemplateWithToken)
    }

    res.status(200).send({ message: 'If an account is associated with this email, it will soon receive an email to reset the password' })
  } catch (error) {
    return next(error)
  }
}

// PUT /passwords/:passwordResetToken
export async function changePassword(req: Request, res: Response, next: NextFunction) { 
  const { passwordResetToken } = req.params
  const { newPassword } = req.body

  try {
    await userService.changePassword(passwordResetToken, newPassword)
    await res.status(200).send({ message: 'Password has been reset successfully' })
  } catch (error) {
    return next(error)
  }
}
