import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

export function generateSalt() {
  // Each byte encodes as two hex digits, so 8 bytes give a 16-character salt.
  return randomBytes(8).toString('hex')
}

export async function toHashWithSalt(password: string) {
  const salt = generateSalt() // 16 chars

  const buf = (await scryptAsync(password, salt, 64)) as Buffer

  // 128 hex chars + '.' + 16-char salt = 145 chars, the length the schema expects.
  return `${buf.toString('hex')}.${salt}`
}

export async function checkIfPasswordIsAMatch(givenPassword: string, storedPasswordHash: string) {
  const [storedHash, salt] = storedPasswordHash.split('.')
  const givenPasswordHash = (await scryptAsync(givenPassword, salt, 64)) as Buffer
  return givenPasswordHash.toString('hex') === storedHash
}

// for reseting the user's password
export function createResetToken() {
  return randomBytes(20).toString('hex')
}
