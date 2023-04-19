import path from 'path'
import { readFile } from 'fs/promises'
import { randomBytes } from 'node:crypto'
import { sendEmail } from '../config/nodemailer'
import { UserNotFound } from '../errors'
import { toHash } from '../utility/passwordHashing'
import UserRepository from '../repositories/user'
import ResetPasswordRepository from '../repositories/password'

async function sendPasswordResetEmail(email: string) {
  const user = await UserRepository.getUserByEmailWithPassword(email)
  if (!user) throw new UserNotFound()

  const passwordResetToken = createPasswordResetToken()
  await ResetPasswordRepository.addToken(passwordResetToken, user.id.toString())
  const html = await getEmailTemplate(passwordResetToken)
  await sendEmail(email, 'Password Reset', html)
}

async function getEmailTemplate(token: string) {
  const templatePath = path.join(__dirname, '../templates/password-reset.html')
  const template = await readFile(templatePath, 'utf-8')
  return template.replace('{{token}}', token)
}

export function createPasswordResetToken () { 
  return randomBytes(20).toString('hex')
}

async function changePassword(token: string, newPassword: string) {
  const userId = await ResetPasswordRepository.grabUserFromToken(token)
  const newPasswordHash = toHash(newPassword)
  const result = await ResetPasswordRepository.changePassword(userId, newPasswordHash)
  if (!result) throw new Error('Password reset did not work')
}

export default {
  sendPasswordResetEmail,
  getEmailTemplate,
  changePassword
}