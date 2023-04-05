import { Router } from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated'
import {
  getProjects, getProject, 
  createProject, editProject, deleteProject,
  addUserToProject, removeUserFromProject
} from '../controllers/projects'

const router = Router()

router.get('/projects', isAuthenticated, getProjects)
router.get('/projects/:projectId', isAuthenticated, getProject)
router.post('/projects/:projectId', isAuthenticated, createProject)
router.put('/projects/:projectId', isAuthenticated, editProject)
router.put('/projects/:projectId/users/:userId', isAuthenticated, addUserToProject)
router.delete('/projects/:projectId/users/:userId', isAuthenticated, removeUserFromProject)
router.delete('/projects/:projectId', isAuthenticated, deleteProject)

export default router
