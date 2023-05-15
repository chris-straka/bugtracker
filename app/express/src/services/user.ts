import type { Roles } from '../types'
import UserRepository from '../repositories/user'
import { toHash } from '../utility/passwordHashing'
import { UserNotFoundError, UserAlreadyExistsError } from '../errors'

async function createUser(username: string, email: string, password: string, role: Roles = 'contributor') {
  const userExists = await UserRepository.checkIfUserExistsByEmailOrUsername(email, username)
  if (userExists) throw new UserAlreadyExistsError()

  const hashedPassword = await toHash(password)

  return await UserRepository.createUser(username, email, hashedPassword, role)
}

async function changeEmail(id: string, newEmail: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserNotFoundError()

  const emailAlreadyExists = await UserRepository.checkIfUserExistsByEmail(newEmail)
  if (emailAlreadyExists) throw new UserAlreadyExistsError()

  await UserRepository.changeEmail(id, newEmail)
}

async function changeUsername(id: string, newUsername: string) {
  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserNotFoundError()

  const usernameAlreadyExists = await UserRepository.checkIfUserExistsByUsername(newUsername)
  if (usernameAlreadyExists) throw new UserAlreadyExistsError()

  await UserRepository.changeUsername(id, newUsername)
}

export default {
  createUser,
  changeEmail,
  changeUsername,
}