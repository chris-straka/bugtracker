import { randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

export async function toHash (password: string): Promise<string> {
  const salt = randomBytes(8).toString('hex')
  const buf = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buf.toString('hex')}.${salt}`
}

export async function comparePasswords (storedPassword: string, uncertainPassword: string): Promise<boolean> {
  const [hashedPassword, salt] = storedPassword.split('.')
  const buf = (await scryptAsync(uncertainPassword, salt, 64)) as Buffer
  return buf.toString('hex') === hashedPassword
}
