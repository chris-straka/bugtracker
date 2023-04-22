import { createTestAccount, createTransport, getTestMessageUrl } from 'nodemailer'

export async function createTransporter() {
  const testAccount = await createTestAccount()

  if (process.env.NODE_ENV === 'production') throw new Error('sendMail() TODO')

  return createTransport({
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
  try {
    const transporter = await createTransporter()

    const res = await transporter.sendMail({
      from: 'no-reply@example.com',
      to,
      subject,
      html
    })

    if (process.env.NODE_ENV !== 'production') console.log('preview URL', getTestMessageUrl(res))
  } catch(error) {
    console.error(error)
  }
}
