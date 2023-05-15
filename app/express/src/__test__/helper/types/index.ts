import { Project , ProjectComment } from '../../../models/Project'
import { Ticket, TicketComment } from '../../../models/Ticket'

export type TestTicket = Omit<Ticket, 'id'> & { id: string }

export type TestTicketComment = Omit<TicketComment, 'id'> & { id: string }

export type TestProject = Omit<Project, 'id'> & { id: string }

export type TestProjectComment = Omit<ProjectComment, 'id'> & { id: string }
