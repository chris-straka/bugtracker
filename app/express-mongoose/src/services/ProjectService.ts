import { IProjectRepository } from '../repositories/ProjectRepository'

export interface IProjectService {
  getProjects(): string[]
}

export function createProjectService(projectRepository: IProjectRepository): IProjectService {
  return {
    getProjects() {
      return projectRepository.getProjects()
    }
  }
}