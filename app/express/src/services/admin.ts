import { Roles } from '../types'
import { UserNotFound, UserAlreadyExistsError } from '../errors'
import UserRepository from '../repositories/user'
import AdminRepository from '../repositories/admin/user'

async function changeUser(newUser: { id: string, username?: string, role?: Roles, email?: string }) {
  const { id, username, email } = newUser

  const user = await UserRepository.getUserById(id)
  if (!user) throw new UserNotFound()

  if (email) {
    const emailAlreadyExists = await UserRepository.checkIfUserExistsByEmail(email)
    if (emailAlreadyExists) throw new UserAlreadyExistsError()
  }

  if (username) {
    const usernameAlreadyExists = await UserRepository.checkIfUserExistsByUsername(username)
    if (usernameAlreadyExists) throw new UserAlreadyExistsError()
  }

  return await AdminRepository.changeUser(newUser)
}

export default {
  changeUser
}