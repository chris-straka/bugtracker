import UserRepository from '../../repositories/user'
import { comparePasswords } from '../../utility/passwordHashing'
import { UserNotFoundError, UserProvidedTheWrongPasswordError } from '../../errors'

export async function authenticateUser(givenEmail: string, givenPassword: string) {
  const user = await UserRepository.getUserWithPasswordByEmail(givenEmail)
  if (!user) throw new UserNotFoundError()
  
  const { password: storedPasswordHash, ...userWithoutPasswordHash } = user
  const passwordsMatch = await comparePasswords(givenPassword, storedPasswordHash)
  if (!passwordsMatch) throw new UserProvidedTheWrongPasswordError()

  return userWithoutPasswordHash
}
