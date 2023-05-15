import { Router } from 'express'
import { body, oneOf, param } from 'express-validator'
import { ProjectStatusArr } from '../types'
import { isAuthenticated, isAuthorized, isProjectMemberOrAdmin, validateInput } from '../middleware'
import { 
  createProject, updateProject, deleteProject, 
  getProjectUsers, addProjectUser, removeProjectUser, 
  getProjectComments, createProjectComment, updateProjectComment,
  deleteProjectComment, getProject,
} from '../controllers/projects'

const router = Router()

router.get('/projects/:projectId', 
  isAuthenticated, 
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  getProject
)

router.post('/projects', 
  isAuthenticated, 
  isAuthorized(['project_manager', 'admin']),
  [
    body('name').isString().trim().isLength({ min: 4, max: 100 }).withMessage('Name must be string between 4 and 100 characters'),
    body('description').isString().trim().isLength({ min: 0, max: 500 }).withMessage('Description must be between 0 and 500 characters')
  ],
  validateInput,
  createProject
)

router.put('/projects/:projectId', 
  isAuthenticated, 
  isAuthorized(['project_manager', 'admin']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('name').optional().isString().isLength({ min: 5, max: 100 }).withMessage('Name must be string between 5 and 100 characters'),
    body('description').optional().isLength({ min: 0, max: 500 }).withMessage('Description must be between 0 and 500 characters'),
    body('status').optional().isIn(ProjectStatusArr),
    oneOf(
      [
        body('name').exists(),
        body('description').exists(),
        body('status').exists()
      ], 
      { message: 'You need to specify a new name, description, or status' }
    )
  ],
  validateInput,
  isProjectMemberOrAdmin,
  updateProject 
)

router.delete('/projects/:projectId', 
  isAuthenticated, 
  isAuthorized(['project_manager', 'admin']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
  ],
  validateInput,
  deleteProject
)

// project users
router.get('/projects/:projectId/users',
  isAuthenticated, 
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  getProjectUsers
)

router.post('/projects/:projectId/users', 
  isAuthenticated, 
  isAuthorized(['project_manager', 'admin']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  addProjectUser
)

router.delete('/projects/:projectId/users/:userId', 
  isAuthenticated, 
  isAuthorized(['project_manager', 'admin']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  removeProjectUser
)

// project comments
router.get('/projects/:projectId/comments', 
  isAuthenticated, 
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  getProjectComments
)

router.post('/projects/:projectId/comments', 
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('comment').isString().isLength({ min: 1, max: 500 }).withMessage('Project comment must be a string of 1-500 characters')
  ],
  validateInput,
  isProjectMemberOrAdmin,
  createProjectComment
)

router.put('/projects/:projectId/comments/:commentId', 
  isAuthenticated, 
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('commentId').isInt().withMessage('Comment ID must be an integer'),
    body('comment').isString().isLength({ min: 1, max: 500 }).withMessage('Project comment must be a string of 1-500 characters')
  ],
  validateInput,
  isProjectMemberOrAdmin,
  updateProjectComment
)

router.delete('/projects/:projectId/comments/:commentId', 
  isAuthenticated, 
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('commentId').isInt().withMessage('Comment ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  deleteProjectComment
)

export default router
