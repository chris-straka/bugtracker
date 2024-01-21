import { Router } from 'express'
import { body, param, oneOf } from 'express-validator'
import { isActive, isAuthenticated, isProjectMemberOrAdmin, projectExists, ticketExists, validateInput } from '../../middleware'
import { TicketPriorityArray, TicketStatusArray, TicketTypeArray } from '../../models/Ticket'
import * as TicketController from '../../controllers/ticket/tickets'

const router = Router()

router.get('/projects/:projectId/tickets',
  isAuthenticated,
  isActive,
  param('projectId').isInt().withMessage('Project ID must be an integer'),
  validateInput,
  isProjectMemberOrAdmin,
  TicketController.getProjectTickets
)

router.post('/projects/:projectId/tickets',
  isAuthenticated,
  isActive,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('name').isString().isLength({ min: 1, max: 100 }).withMessage('Name must be a string between 1 and 100 characters'),
    body('description').isString().isLength({ min: 1, max: 500 }).withMessage('Description must be a string between 1 and 500 characters'),
    body('type').optional().isString().trim().isIn(TicketTypeArray),
    body('priority').optional().isString().trim().isIn(TicketPriorityArray),
    body('status').optional().isString().trim().isIn(TicketStatusArray)
  ],
  validateInput,
  projectExists,
  isProjectMemberOrAdmin,
  TicketController.createProjectTicket
)

router.put('/projects/:projectId/tickets/:ticketId',
  isAuthenticated,
  isActive,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('name').optional().isString().isLength({ min: 1, max: 100 }).withMessage('Name must be a string between 1 and 100 characters'),
    body('description').optional().isString().isLength({ min: 1, max: 500 }).withMessage('Description must be a string between 1 and 500 characters'),
    body('type').optional().isString().trim().isIn(TicketTypeArray),
    body('priority').optional().isString().trim().isIn(TicketPriorityArray),
    body('status').optional().isString().trim().isIn(TicketStatusArray),
    oneOf(
      [
        body('name').exists(),
        body('description').exists(),
        body('type').exists(),
        body('priority').exists(),
        body('status').exists()
      ], 
      { message: 'You need to specify either a new name, description, or status' }
    )
  ],
  validateInput,
  projectExists,
  ticketExists,
  isProjectMemberOrAdmin,
  TicketController.updateProjectTicket
)

router.delete('/projects/:projectId/tickets/:ticketId',
  isAuthenticated,
  isActive,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
  ],
  validateInput,
  projectExists,
  ticketExists,
  isProjectMemberOrAdmin,
  TicketController.deleteProjectTicket
)

export default router