import { IProjectService } from './project-service'

export interface IProjectController {
  getProjects(): string[]
}

export function createProjectController(projectService: IProjectService): IProjectController {

  return {
    getProjects() {
      return projectService.getProjects()
    }
  }
}