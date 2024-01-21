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
  const project = await createProject(pm.id.toString(), projectName, projectDescription)
  return { pm, project }
}

export async function createPmAndProjectWithUsers(numberOfProjectUsers: number) {
  const { pm, project } = await createPmAndProject()
  const users = await createNewUsersAndAddThemToProject(project.id.toString(), numberOfProjectUsers)
  return { pm, project, users }
}

export async function createPmAndProjectWithTicket(ticketPriority?: TicketPriority, ticketType?: TicketType) {
  const { pm, project } = await createPmAndProject()
  const ticket = await createTicket(project.id.toString(), pm.id.toString(), ticketPriority, ticketType)
  return { pm, project, ticket }
}

export async function createPmAndProjectWithTickets(numberOfTickets: number) {
  const { pm, project } = await createPmAndProject()
  const tickets = await createTickets(project.id.toString(), pm.id.toString(), numberOfTickets)
  return { pm, project, tickets }
}

export async function createPmAndProjectWithComment() {
  const { pm, project } = await createPmAndProject()
  const projectComment = await createProjectComment(pm.id.toString(), project.id.toString())
  return { pm, project, projectComment }
}

export async function createPmAndProjectWithUsersAndComments(numberOfUsers: number, numberOfComments: number) {
  const { pm, project } = await createPmAndProject()
  const users = await createNewUsersAndAddThemToProject(project.id.toString(), numberOfUsers)
  const projectComments = await createProjectComments(project.id.toString(), pm.id.toString(), numberOfComments)
  return { pm, project, users, projectComments }
}

export async function createPmAndProjectWithUsersAndTickets(numberOfUsers: number, numberOfTickets: number) {
  const { pm, project, users } = await createPmAndProjectWithUsers(numberOfUsers)
  const tickets = await createTickets(project.id.toString(), pm.id.toString(), numberOfTickets)
  return { pm, project, users, tickets }
}

export async function createPmAndProjects(numberOfProjects: number, description?: string) {
  const pm = await createTestUser('project_manager')
  const projects = await createProjects(pm.id.toString(), numberOfProjects, description)
  return { pm, projects }
}
