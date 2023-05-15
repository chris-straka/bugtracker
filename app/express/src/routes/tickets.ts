import { Router } from 'express'
import { body, param } from 'express-validator'
import { TicketPriorityArr, TicketStatusArr, TicketTypeArr } from '../types'
import { isAuthenticated, isAuthorized, isProjectMemberOrAdmin, validateInput } from '../middleware'
import { 
  getProjectTickets, createProjectTicket, 
  updateProjectTicket, deleteProjectTicket 
} from '../controllers/tickets/tickets'
import { 
  addUserToTicket, createTicketComment, deleteTicketComment, 
  getTicketComments, getTicketUsers, removeUserFromTicket, 
  updateTicketComment 
} from '../controllers/tickets'

const router = Router()

router.get('/projects/:projectId/tickets',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  getProjectTickets
)

router.post('/projects/:projectId/tickets',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('name').isString().isLength({ min: 1, max: 100 }).withMessage('Name must be a string between 1 and 100 characters'),
    body('description').isString().isLength({ min: 1, max: 500 }).withMessage('Description must be a string between 1 and 500 characters'),
    body('type').isString().trim().isIn(TicketTypeArr),
    body('priority').isString().trim().isIn(TicketPriorityArr),
    body('status').optional().isString().trim().isIn(TicketStatusArr)
  ],
  validateInput,
  isProjectMemberOrAdmin,
  createProjectTicket
)

router.put('/projects/:projectId/tickets/:ticketId',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('name').isString().isLength({ min: 1, max: 100 }).withMessage('Name must be a string between 1 and 100 characters'),
    body('description').isString().isLength({ min: 1, max: 500 }).withMessage('Description must be a string between 1 and 500 characters'),
    body('type').isString().trim().isIn(TicketTypeArr),
    body('priority').isString().trim().isIn(TicketPriorityArr),
    body('status').optional().isString().trim().isIn(TicketStatusArr)
  ],
  validateInput,
  isProjectMemberOrAdmin,
  updateProjectTicket
)

router.delete('/projects/:projectId/tickets/:ticketId',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  deleteProjectTicket
)

// ticket users
router.get('/projects/:projectId/tickets/:ticketId/users',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  getTicketUsers
)

router.post('/projects/:projectId/tickets/:ticketId/users',
  isAuthenticated,
  isAuthorized(['project_manager', 'admin']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  addUserToTicket
)

router.delete('/projects/:projectId/tickets/:ticketId/users/:userId',
  isAuthenticated,
  isAuthorized(['project_manager', 'admin']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  removeUserFromTicket
)

// ticket comments
router.get('/projects/:projectId/tickets/:ticketId/comments',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  getTicketComments
)

router.post('/projects/:projectId/tickets/:ticketId/comments',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('comment').isString().isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters') ],
  validateInput,
  isProjectMemberOrAdmin,
  createTicketComment
)

router.put('/projects/:projectId/tickets/:ticketId/comments/:commentId',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    param('commentId').isInt().withMessage('Comment ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  updateTicketComment
)

router.delete('/projects/:projectId/tickets/:ticketId/comments/:commentId',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    param('commentId').isInt().withMessage('Comment ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  deleteTicketComment
)

export default router