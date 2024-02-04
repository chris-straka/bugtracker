import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

export function generateSalt() {
  /** 
   * randomBytes(8) gives me 8 random bytes (8 chars)
   * 
   * each char/byte (8 bits) can represent 256 values because eight bits (00000000) can represent 2^8 = 256 values
   * 
   * each hex digit can represent 16 values (0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F) as opposed to 2 values (0,1) 
   * so two hex digits can then represent 256 values (2^16 = 256)
   * 
   * Since randomBytes(8) gives me 8 random bytes, I can represent that with 16 hex digits (8 bytes * 2 hex per byte)
   */
  return randomBytes(8).toString('hex') // 16 hex characters
}

export async function toHashWithSalt(password: string) {
  const salt = generateSalt() // 16 chars

  // hash their password with the salt and make it 64 chars long
  const buf = await scryptAsync(password, salt, 64) as Buffer

  // each byte/char can be represented by 2 hex characters so 64 * 2 = 128 
  // 128 + 1 (.) == 129
  // 129 + 16 char salt = 145 
  return `${buf.toString('hex')}.${salt}`
}

export async function checkIfPasswordIsAMatch(givenPassword: string, storedPasswordHash: string) {
  const [storedHash, salt] = storedPasswordHash.split('.')
  const givenPasswordHash = await scryptAsync(givenPassword, salt, 64) as Buffer
  return givenPasswordHash.toString('hex') === storedHash
}

// for reseting the user's password
export function createResetToken () { 
  return randomBytes(20).toString('hex')
}