import { faker } from '@faker-js/faker'
import { toHashWithSalt, checkIfPasswordIsAMatch } from '../../utility/password'

describe('Password utils', () => {
  const password = faker.internet.password()

  test('toHash() should produce the correct hash', async () => {
    // my db schema requires a length of 145 for passwords
    expect(await toHashWithSalt(password)).toHaveLength(145)
  })

  test('toHash() should be producing different hashes for different passwords', async () => {
    const hashedPassword = await toHashWithSalt(password)

    // my db schema requires a length of 145 for passwords
    expect(hashedPassword).toHaveLength(145)

    const otherPassword = faker.internet.password()
    const otherHashedPassword = await toHashWithSalt(otherPassword)

    expect(otherHashedPassword).not.toBe(hashedPassword)
  })

  test('comparePasswords() should return true if the hashed password is correct', async () => {
    const hashedPassword = await toHashWithSalt(password)
    const result = await checkIfPasswordIsAMatch(password, hashedPassword)
    expect(result).toBe(true)
  })

  test('comparePasswords() should return false if the hashed password is incorrect', async () => {
    const hashedPassword = await toHashWithSalt(password)
    const wrongPassword = faker.internet.password()
    const result = await checkIfPasswordIsAMatch(wrongPassword, hashedPassword)
    expect(result).toBe(false)
  })
})
