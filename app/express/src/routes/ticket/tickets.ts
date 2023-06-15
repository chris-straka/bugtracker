import { Router } from 'express'
import { body, param } from 'express-validator'
import { TicketPriorityArray, TicketStatusArray, TicketTypeArray } from '../../models/Ticket'
import { isAuthenticated, isProjectMemberOrAdmin, validateInput } from '../../middleware'
import * as TicketController from '../../controllers/ticket/tickets'

const router = Router()

router.get('/projects/:projectId/tickets',
  isAuthenticated,
  param('projectId').isInt().withMessage('Project ID must be an integer'),
  validateInput,
  isProjectMemberOrAdmin,
  TicketController.getProjectTickets
)

router.post('/projects/:projectId/tickets',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    body('name').isString().isLength({ min: 1, max: 100 }).withMessage('Name must be a string between 1 and 100 characters'),
    body('description').isString().isLength({ min: 1, max: 500 }).withMessage('Description must be a string between 1 and 500 characters'),
    body('type').isString().trim().isIn(TicketTypeArray),
    body('priority').isString().trim().isIn(TicketPriorityArray),
    body('status').optional().isString().trim().isIn(TicketStatusArray)
  ],
  validateInput,
  isProjectMemberOrAdmin,
  TicketController.createProjectTicket
)

router.put('/projects/:projectId/tickets/:ticketId',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('name').isString().isLength({ min: 1, max: 100 }).withMessage('Name must be a string between 1 and 100 characters'),
    body('description').isString().isLength({ min: 1, max: 500 }).withMessage('Description must be a string between 1 and 500 characters'),
    body('type').isString().trim().isIn(TicketTypeArray),
    body('priority').isString().trim().isIn(TicketPriorityArray),
    body('status').optional().isString().trim().isIn(TicketStatusArray)
  ],
  validateInput,
  isProjectMemberOrAdmin,
  TicketController.updateProjectTicket
)

router.delete('/projects/:projectId/tickets/:ticketId',
  isAuthenticated,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  TicketController.deleteProjectTicket
)

export default router