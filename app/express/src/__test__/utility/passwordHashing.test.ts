import { faker } from '@faker-js/faker'
import { toHashWithSalt, checkIfPasswordIsAMatch } from '../../utility/password'

describe('Password utils', () => {
  const password = faker.internet.password()
  const hashedPassword = toHashWithSalt(password)

  test('toHash() should produce the correct hash', () => {
    // my db schema requires a length of 145 for passwords
    expect(hashedPassword).toHaveLength(145) 
  })

  test('toHash() should be producing different hashes for different passwords', () => {
    // my db schema requires a length of 145 for passwords
    expect(hashedPassword).toHaveLength(145) 

    const otherPassword = faker.internet.password()
    const otherHashedPassword = toHashWithSalt(otherPassword)

    expect(otherHashedPassword).not.toBe(hashedPassword)
  })

  test('comparePasswords() should return true if the hashed password is correct', () => {
    const result = checkIfPasswordIsAMatch(password, hashedPassword)
    expect(result).toBe(true)
  })

  test('comparePasswords() should return false if the hashed password is incorrect', () => {
    const wrongPassword = faker.internet.password()
    const result = checkIfPasswordIsAMatch(wrongPassword, hashedPassword)
    expect(result).toBe(false)
  })
})
