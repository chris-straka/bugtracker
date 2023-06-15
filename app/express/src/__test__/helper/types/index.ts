import type { Project } from '../../../models/Project'
import type { ProjectComment } from '../../../models/ProjectComment'
import type { Ticket } from '../../../models/Ticket'
import type { TicketComment } from '../../../models/TicketComment'

export type TestTicket = Omit<Ticket, 'id'> & { id: string }

export type TestTicketComment = Omit<TicketComment, 'id'> & { id: string }

export type TestProject = Omit<Project, 'id'> & { id: string }

export type TestProjectComment = Omit<ProjectComment, 'id'> & { id: string }
