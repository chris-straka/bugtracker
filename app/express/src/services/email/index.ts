import { join } from 'path'
import { readFile } from 'fs/promises'
import { getTestMessageUrl } from 'nodemailer'
import { createTransporter } from '../../config/nodemailer'

export class EmailService {
  emailResetPath = join(__dirname, './templates/email-reset.html')
  passwordResetPath = join(__dirname, './templates/password-reset.html')

  async getEmailTemplate(path: string) {
    return await readFile(path, 'utf-8')
  }

  async getEmailResetTemplate() {
    return await this.getEmailTemplate(this.emailResetPath)
  }

  async getPasswordResetTemplate() {
    return await this.getEmailTemplate(this.passwordResetPath)
  }

  async embedTokenInEmailTemplate(token: string, template: string) {
    return template.replace('{{token}}', token)
  }

  async sendEmail(to: string, subject: string, html: string) {
    const transporter = await createTransporter()
    const from = process.env.EMAIL_FROM
    const res = await transporter.sendMail({ from, to, subject, html })

    if (process.env.NODE_ENV === 'development') { 
      console.log('preview URL', getTestMessageUrl(res))
    }
  }
}
