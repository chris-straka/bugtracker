import { Router } from 'express'
import { IProjectController } from './project-controller'

export const projectRoutes = (projectController: IProjectController) => {
  const router = Router()

  router.get('/', projectController.getProjects)

  return router
}