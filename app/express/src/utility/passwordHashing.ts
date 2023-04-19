import { randomBytes, scryptSync } from 'crypto'

export function generateSalt() {
  /** 
   * randomBytes(8) gives me 8 random bytes (8 chars)
   * 
   * each char/byte can represent 256 values because eight bits (00000000) can represent 2^8 = 256 values
   * 
   * each hex digit can represent 16 values (0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F) as opposed to 2 values (0,1) 
   * so I only need two hex digits for every byte (because 2^16 = 256)
   * 
   * Since I have 8 bytes/chars, and each char can be represented by 2 hex numbers, I end up with a salt of 16 chars
   */
  return randomBytes(8).toString('hex')
}

export function toHash(password: string) {
  const salt = generateSalt() // 16 chars

  // hash their password with the salt and make it 64 chars long
  const buf = scryptSync(password, salt, 64)

  // each byte/char can be represented by 2 hex characters so 64 * 2 = 128 
  // 128 + 1 (.) == 129
  // 129 + 16 char salt = 145 
  return `${buf.toString('hex')}.${salt}`
}

export function comparePasswords(givenPassword: string, storedPasswordHash: string) {
  const [storedHash, salt] = storedPasswordHash.split('.')
  const givenPasswordHash = scryptSync(givenPassword, salt, 64).toString('hex')
  return givenPasswordHash === storedHash
}
