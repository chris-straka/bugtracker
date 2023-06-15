import { IProjectService } from '../services/ProjectService'

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