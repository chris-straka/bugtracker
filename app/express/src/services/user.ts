import { getUser, createUser } from '../repositories/User'
import { toHash, comparePasswords } from './password'
import { 
  UserDoesNotExistError, UserProvidedTheWrongPasswordError, 
  UserAlreadyExistsError 
} from '../errors'

export async function authenticateUser (email: string, givenPassword: string) {
  const user = await getUser(email)
  if (!user) throw new UserDoesNotExistError()
  const { password: storedPassword, ...userWithoutPassword } = user

  const givenPasswordHashed = await toHash(givenPassword)
  const passwordsMatch = await comparePasswords(givenPasswordHashed, storedPassword)

  if (!passwordsMatch) throw new UserProvidedTheWrongPasswordError()

  return userWithoutPassword
}

export async function createNewUser (name: string, email: string, password: string) {
  const user = await getUser(email)
  if (user) throw new UserAlreadyExistsError()

  const hashedPassword = await toHash(password)
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {password: _, ...userWithoutPassword } = await createUser(name, email, hashedPassword)

  return userWithoutPassword
}
