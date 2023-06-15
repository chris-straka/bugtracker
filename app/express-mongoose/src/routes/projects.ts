import { Router } from 'express'
import { IProjectController } from '../controllers/ProjectController'

export const projectRoutes = (projectController: IProjectController) => {
  const router = Router()

  router.get('/', projectController.getProjects)

  return router
}