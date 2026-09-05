import { createTransport, createTestAccount } from 'nodemailer'

export async function createTransporter() {
  // Tests must never reach the network. jsonTransport serialises the message
  // and resolves, so services and spies behave exactly as they would in prod.
  if (process.env.NODE_ENV === 'test') {
    return createTransport({ jsonTransport: true })
  }

  if (process.env.NODE_ENV !== 'production') {
    // Ethereal hands out a throwaway inbox. Use ITS smtp host/port: the previous
    // version took the account credentials but still pointed the transport at the
    // unset SMTP_* vars, so dev mail was posted to localhost:587 and refused.
    const testAccount = await createTestAccount()

    return createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    })
  }

  return createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}
