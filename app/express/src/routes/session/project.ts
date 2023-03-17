import { Router } from "express";
import { 
  getAllProjects, getProject, getProjectComments, 
  createProject, editProject, deleteProject, 
  addUserToProject, removeUserFromProject 
} from "../../controllers/ProjectController"

const router = Router()

router.get('/projects', getAllProjects)
router.get('/projects/:projectId', getProject)
router.post('/projects/:projectId', createProject)

router.put('/project/:projectId', editProject)

router.put('/project/:projectId/users/:userId', addUserToProject)
router.delete('/project/:projectId/users/:userId', removeUserFromProject)

router.delete('/projects/:projectId', deleteProject)
router.get('/projects/:projectId/comments', getProjectComments)

export default router 
