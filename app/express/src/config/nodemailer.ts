import nodemailer from 'nodemailer'

async function createTransporter() {
  const testAccount = await nodemailer.createTestAccount()

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })
}

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = await createTransporter()

  const res = await transporter.sendMail({
    from: 'todo@gmail.com',
    to,
    subject,
    html
  })

  if (process.env.NODE_ENV !== 'production') console.log('preview URL', nodemailer.getTestMessageUrl(res))
}