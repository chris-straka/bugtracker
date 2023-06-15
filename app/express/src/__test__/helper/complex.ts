import type { TicketPriority, TicketType } from '../../models/Ticket'
import { createTestUser } from './user'
import { createTicket, createTickets } from './tickets'
import { 
  createProject, createProjects, createProjectComments, 
  createNewUsersAndAddThemToProject, createProjectComment 
} from './project'

// pm = project manager
export async function createPmAndProject(projectName?: string, projectDescription?: string) {
  const pm = await createTestUser('project_manager')
  const project = await createProject(pm.id, projectName, projectDescription)
  return { pm, project }
}

export async function createPmAndProjectWithUsers(numberOfProjectUsers: number) {
  const { pm, project } = await createPmAndProject()
  const users = await createNewUsersAndAddThemToProject(project.id, numberOfProjectUsers)
  return { pm, project, users }
}

export async function createPmAndProjectWithTicket(ticketPriority?: TicketPriority, ticketType?: TicketType) {
  const { pm, project } = await createPmAndProject()
  const ticket = await createTicket(project.id, pm.id, ticketPriority, ticketType)
  return { pm, project, ticket }
}

export async function createPmAndProjectWithTickets(numberOfTickets: number) {
  const { pm, project } = await createPmAndProject()
  const tickets = await createTickets(project.id, pm.id, numberOfTickets)
  return { pm, project, tickets }
}

export async function createPmAndProjectWithComment() {
  const { pm, project } = await createPmAndProject()
  const projectComment = await createProjectComment(pm.id, project.id)
  return { pm, project, projectComment }
}

export async function createPmAndProjectWithUsersAndComments(numberOfUsers: number, numberOfComments: number) {
  const { pm, project } = await createPmAndProject()
  const users = await createNewUsersAndAddThemToProject(project.id, numberOfUsers)
  const projectComments = await createProjectComments(project.id, pm.id, numberOfComments)
  return { pm, project, users, projectComments }
}

export async function createPmAndProjectWithUsersAndTickets(numberOfUsers: number, numberOfTickets: number) {
  const { pm, project, users } = await createPmAndProjectWithUsers(numberOfUsers)
  const tickets = await createTickets(project.id, pm.id, numberOfTickets)
  return { pm, project, users, tickets }
}

export async function createPmAndProjects(numberOfProjects: number, description?: string) {
  const pm = await createTestUser('project_manager')
  const projects = await createProjects(pm.id, numberOfProjects, description)
  return { pm, projects }
}
