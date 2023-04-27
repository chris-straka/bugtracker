import ProjectRepository from '../../repositories/project/project'
import { ProjectAlreadyExistsError } from '../../errors'

export async function createProject(name: string, description: string, ownerId: string) {
  const projectExists = await ProjectRepository.checkIfProjectExistsByName(name)
  if (projectExists) throw new ProjectAlreadyExistsError()

  const project = await ProjectRepository.createProject(name, description, ownerId)

  return 
}


// const userExists = await UserRepository.checkIfUserExistsByEmailOrUsername(email, username)
// if (userExists) throw new UserAlreadyExistsError()

// const hashedPassword = await toHash(password)

// return await UserRepository.createUser(username, email, hashedPassword, role)