import type { Roles } from '../types'
import UserRepository from '../repositories/user'
import { toHash, comparePasswords } from '../utility/passwordHashing'
import { UserNotFound, UserProvidedTheWrongPasswordError, UserAlreadyExistsError } from '../errors'

async function authenticateUser(givenEmail: string, givenPassword: string) {
  const user = await UserRepository.getUserByEmailWithPassword(givenEmail)
  if (!user) throw new UserNotFound()
  
  const { password: storedPasswordHash, ...userWithoutPasswordHash } = user
  const passwordsMatch = await comparePasswords(givenPassword, storedPasswordHash)
  if (!passwordsMatch) throw new UserProvidedTheWrongPasswordError()

  return userWithoutPasswordHash
}

async function createUser(username: string, email: string, password: string, role: Roles) {
  const userExists = await UserRepository.checkIfUserExistsByEmailOrUsername(email, username)
  if (userExists) throw new UserAlreadyExistsError()

  const hashedPassword = await toHash(password)

  return await UserRepository.createUser(username, email, hashedPassword, role)
}

async function changeEmail(id: string, newEmail: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserNotFound()

  const emailAlreadyExists = await UserRepository.checkIfUserExistsByEmail(newEmail)
  if (emailAlreadyExists) throw new UserAlreadyExistsError()

  await UserRepository.changeEmail(id, newEmail)
}

async function changeUsername(id: string, newUsername: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserNotFound()

  const usernameAlreadyExists = await UserRepository.checkIfUserExistsByUsername(newUsername)
  if (usernameAlreadyExists) throw new UserAlreadyExistsError()

  await UserRepository.changeUsername(id, newUsername)
}

async function getUserById(id: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserNotFound()
  return user
}

async function deleteUserById(id: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserNotFound()
  await UserRepository.deleteUserById(id)
}

async function deleteUserByEmail(email: string) {
  const user = await UserRepository.checkIfUserExistsByEmail(email)
  if (!user) throw new UserNotFound()
  await UserRepository.deleteUserByEmail(email)
}

export default {
  authenticateUser,
  createUser,
  changeEmail,
  changeUsername,
  getUserById,
  deleteUserById,
  deleteUserByEmail
}