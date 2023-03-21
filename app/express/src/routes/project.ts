import { Router } from "express";
import {
  getAllProjects, getProject, getProjectComments,
  createProject, editProject, deleteProject,
  addUserToProject, removeUserFromProject
} from "../controllers/ProjectController"
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router()

router.get('/projects', isAuthenticated, getAllProjects)
router.get('/projects/:projectId', isAuthenticated, getProject)
router.post('/projects/:projectId', isAuthenticated, createProject)
router.put('/projects/:projectId', isAuthenticated, editProject)
router.put('/projects/:projectId/users/:userId', isAuthenticated, addUserToProject)
router.delete('/projects/:projectId/users/:userId', isAuthenticated, removeUserFromProject)
router.delete('/projects/:projectId', isAuthenticated, deleteProject)
router.get('/projects/:projectId/comments', isAuthenticated, getProjectComments)

export default router