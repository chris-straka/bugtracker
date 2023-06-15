import { createTransport, createTestAccount } from 'nodemailer'

export async function createTransporter() {
  let user = process.env.SMTP_USER
  let pass = process.env.SMTP_PASS

  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await createTestAccount()
    user = testAccount.user
    pass = testAccount.pass
  }

  return createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user, pass }
  })
}
