import { faker } from '@faker-js/faker'
import { toHash, comparePasswords } from '../../utility/passwordHashing'

describe('Password utils', () => {
  const password = faker.internet.password()
  const hashedPassword = toHash(password)

  test('toHash() should produce the correct hash', () => {
    // my db schema requires a length of 145 for passwords
    expect(hashedPassword).toHaveLength(145) 
  })

  test('toHash() should be producing different hashes for different passwords', () => {
    // my db schema requires a length of 145 for passwords
    expect(hashedPassword).toHaveLength(145) 

    const otherPassword = faker.internet.password()
    const otherHashedPassword = toHash(otherPassword)

    expect(otherHashedPassword).not.toBe(hashedPassword)
  })

  test('comparePasswords() should return true if the hashed password is correct', () => {
    const result = comparePasswords(password, hashedPassword)
    expect(result).toBe(true)
  })

  test('comparePasswords() should return false if the hashed password is incorrect', () => {
    const wrongPassword = faker.internet.password()
    const result = comparePasswords(wrongPassword, hashedPassword)
    expect(result).toBe(false)
  })
})
