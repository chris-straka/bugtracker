import { Request, Response, NextFunction } from 'express'
import ResetPasswordService from '../services/password'

// POST /passwords
export async function forgetPassword(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body

  try {
    await ResetPasswordService.sendPasswordResetEmail(email)
    res.status(200).send()
  } catch (error) {
    return next(error)
  }
}

// PUT /passwords/:passwordResetToken
export async function resetPassword(req: Request, res: Response, next: NextFunction) { 
  const { passwordResetToken } = req.params
  const { newPassword } = req.body

  try {
    await ResetPasswordService.changePassword(passwordResetToken, newPassword)
    await res.status(204).send()
  } catch (error) {
    return next(error)
  }
}