import { Router } from "express";
import { getAllProjects, getProjectComments, createProject, deleteProject } from "../../controllers/ProjectController"

const router = Router()

router.get('/projects', getAllProjects)
router.get('/projects/:projectId', getProjectComments)
router.post('/projects/:projectId', createProject)
router.delete('/projects/:projectId', deleteProject)
router.get('/projects/:projectId/comments', getProjectComments)

export default router 
