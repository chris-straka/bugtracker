import type { User } from '../models/User'
import { getUser } from '../repositories/User'
import { toHash, comparePasswords } from './password'

type AuthResult = Omit<User, 'password'> 

export async function authenticateUser (email: string, givenPassword: string): Promise<AuthResult> {
  const { password: storedPassword, ...userWithoutPassword } = await getUser(email)

  const givenPasswordHashed = await toHash(givenPassword)
  const passwordsMatch = await comparePasswords(givenPasswordHashed, storedPassword)

  if (!passwordsMatch) throw new Error()

  return userWithoutPassword
}

export async function createUser (name: string, email: string, password: string): Promise<void> {
  const userAlreadyExists = await getUser(email)


  console.log(name)
  console.log(email)
  console.log(password)
}
