import path from 'path'
import { readFile } from 'fs/promises'
import { randomBytes } from 'node:crypto'
import { UserNotFoundError, InvalidOrMissingTokenError } from '../../errors'
import { toHash } from '../../utility/passwordHashing'
import { sendEmail } from '../../config/nodemailer'

import UserRepository from '../../repositories/user'
import ResetPasswordRepository from '../../repositories/password'

export async function sendPasswordResetEmail(email: string) {
  const user = await UserRepository.getUserWithPasswordByEmail(email)
  if (!user) throw new UserNotFoundError()

  const passwordResetToken = createPasswordResetToken()
  await ResetPasswordRepository.storeUserIdForPasswordReset(passwordResetToken, user.id.toString())
  const html = await getEmailTemplate(passwordResetToken)

  await sendEmail(email, 'Password Reset', html)
}

async function getEmailTemplate(token: string) {
  const templatePath = path.join(__dirname, '../templates/password-reset.html')
  const template = await readFile(templatePath, 'utf-8')
  return template.replace('{{token}}', token)
}

function createPasswordResetToken () { 
  return randomBytes(20).toString('hex')
}

export async function changePasswordViaResetToken(token: string, newPassword: string) {
  const userId = await ResetPasswordRepository.getUserFromRedisUsingPasswordResetToken(token)
  if (!userId) throw new InvalidOrMissingTokenError()

  const newPasswordHash = toHash(newPassword)
  const result = await ResetPasswordRepository.changePassword(userId, newPasswordHash)
  if (!result) throw new Error('Password was not able to reset in the DB')
}
