import { Router } from "express";
import {
  getTicket, getAllTicketsForProject, createTicket,
  deleteTicket, editTicket, assignDeveloperToTicket,
  removeDeveloperFromTicket, getTicketComments,
  createTicketComment, editTicketComment, deleteTicketComment
} from "../../controllers/TicketController";

const router = Router()

router.get('/tickets', getAllTicketsForProject)
router.get('/tickets/:ticketId', getTicket)
router.post('/tickets/:ticketId', createTicket)

router.put('/tickets/:ticketId/users/:userId', assignDeveloperToTicket)
router.delete('/tickets/:ticketId/users/:userId', removeDeveloperFromTicket)

router.put('/tickets/:ticketId', editTicket)
router.delete('/tickets/:ticketId', deleteTicket)

router.get('/tickets/:ticketId/comments', getTicketComments)
router.post('/tickets/:ticketId/comments', createTicketComment)
router.put('/tickets/:ticketId/comments/:commentId', editTicketComment)
router.delete('/tickets/:ticketId/comments/:commentId', deleteTicketComment)

export default router 
