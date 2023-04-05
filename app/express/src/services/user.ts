import type { Roles } from '../types'
import UserRepository from '../repositories/User'
import { toHash, comparePasswords } from './password'
import { UserDoesNotExistError, UserProvidedTheWrongPasswordError, UserAlreadyExistsError } from '../errors'

async function authenticateUser(email: string, givenPassword: string) {
  const user = await UserRepository.getUserByEmail(email)
  if (!user) throw new UserDoesNotExistError()
  
  const { password: storedPassword, ...userWithoutPassword } = user

  const givenPasswordHashed = await toHash(givenPassword)
  const passwordsMatch = await comparePasswords(givenPasswordHashed, storedPassword)

  if (!passwordsMatch) throw new UserProvidedTheWrongPasswordError()

  return userWithoutPassword
}

async function createNewUser(username: string, email: string, password: string, role: Roles) {
  const userExists = await UserRepository.checkIfUserExistsByEmail(email)
  if (userExists) throw new UserAlreadyExistsError()

  const hashedPassword = await toHash(password)

  return await UserRepository.createUser(username, email, hashedPassword, role)
}

async function changeEmail(id: string, newEmail: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserDoesNotExistError()

  await UserRepository.changeEmail(id, newEmail)
}

async function changeUsername(id: string, newUsername: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserDoesNotExistError()

  await UserRepository.changeUsername(id, newUsername)
}

async function getUserById(id: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserDoesNotExistError()
  return user
}

async function deleteUserById(id: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserDoesNotExistError()

  await UserRepository.deleteUserById(id)
}

export default {
  authenticateUser,
  createNewUser,
  changeEmail,
  changeUsername,
  getUserById,
  deleteUserById
}