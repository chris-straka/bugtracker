import { Router } from "express";
import {
  getTicket, getAllTicketsForProject, createTicket,
  deleteTicket, editTicket, assignDeveloperToTicket,
  removeDeveloperFromTicket, getTicketComments,
  createTicketComment, editTicketComment, deleteTicketComment
} from "../controllers/TicketController";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router()

router.get('/tickets', isAuthenticated, getAllTicketsForProject)
router.get('/tickets/:ticketId', isAuthenticated, getTicket)
router.post('/tickets/:ticketId', isAuthenticated, createTicket)

router.put('/tickets/:ticketId/users/:userId', isAuthenticated, assignDeveloperToTicket)
router.delete('/tickets/:ticketId/users/:userId', isAuthenticated, removeDeveloperFromTicket)

router.put('/tickets/:ticketId', isAuthenticated, editTicket)
router.delete('/tickets/:ticketId', isAuthenticated, deleteTicket)

router.get('/tickets/:ticketId/comments', isAuthenticated, getTicketComments)
router.post('/tickets/:ticketId/comments', isAuthenticated, createTicketComment)
router.put('/tickets/:ticketId/comments/:commentId', isAuthenticated, editTicketComment)
router.delete('/tickets/:ticketId/comments/:commentId', isAuthenticated, deleteTicketComment)

export default router
