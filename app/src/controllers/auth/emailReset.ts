import type { Request, Response, NextFunction } from 'express'
import { emailResetService } from '../../services'
import { routeParam } from '../../utility'

// PUT /emails/:emailResetToken
export async function changeEmailViaResetToken(req: Request, res: Response, next: NextFunction) {
  const emailResetToken = routeParam(req.params.emailResetToken)

  try {
    const { oldEmail, newEmail } = await emailResetService.grabEmailsFromToken(emailResetToken)

    await emailResetService.changeEmail(oldEmail, newEmail)
    await res.status(200).send({ message: 'Email changed successfully' })
  } catch (error) {
    return next(error)
  }
}
