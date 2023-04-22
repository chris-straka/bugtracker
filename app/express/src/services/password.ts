import path from 'path'
import { readFile } from 'fs/promises'
import { randomBytes } from 'node:crypto'
import { UserNotFound, InvalidOrMissingToken } from '../errors'
import { toHash } from '../utility/passwordHashing'
import { sendEmail } from '../config/nodemailer'
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

function createPasswordResetToken () { 
  return randomBytes(20).toString('hex')
}

async function changePassword(token: string, newPassword: string) {
  const userId = await ResetPasswordRepository.grabUserFromToken(token)
  if (!userId) throw new InvalidOrMissingToken()

  const newPasswordHash = toHash(newPassword)
  const result = await ResetPasswordRepository.changePassword(userId, newPasswordHash)
  if (!result) throw new Error('Password was not able to reset in the DB')
}

export default {
  sendPasswordResetEmail,
  getEmailTemplate,
  changePassword,
  createPasswordResetToken
}