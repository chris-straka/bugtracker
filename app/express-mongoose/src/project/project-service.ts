import { IProjectRepository } from './project-repository'

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