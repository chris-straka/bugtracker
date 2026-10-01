import { createTransport, createTestAccount } from 'nodemailer'

export async function createTransporter() {
  // Keep tests off the network. jsonTransport serializes the message and resolves,
  // so services and spies behave as they do in production.
  if (process.env.NODE_ENV === 'test') {
    return createTransport({ jsonTransport: true })
  }

  if (process.env.NODE_ENV !== 'production') {
    // Ethereal provides a throwaway inbox. Send through its SMTP host and port,
    // since the SMTP_* vars are usually unset in dev.
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
