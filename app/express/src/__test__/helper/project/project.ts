import { faker } from '@faker-js/faker'
import { createProjectManager } from '../user'
import { addUsersToProject, addUserToProject, createProjectComments } from '.'
import { createTicket, createTickets, createTicketComments, assignUserToTicket } from '../tickets'
import ProjectRepository from '../../../repositories/project/project'
import { TicketPriority, TicketType } from '../../../types'

async function createProject(ownerId: string, name?: string, description?: string) {
  const project = await ProjectRepository
    .createProject(
      name || faker.company.name(), 
      description || faker.company.bs(), 
      ownerId
    )

  return { ...project, id: project.id.toString() }
}

export async function createPmAndProject(name?: string, description?: string) {
  const pm = await createProjectManager()
  const project = await createProject(pm.id, name, description)
  return { pm, project }
}

export async function createPmAndProjects(numberOfProjects: number, description?: string) {
  const pm = await createProjectManager()
  const projects = []

  for (let i = 0; i < numberOfProjects; i++) {
    const project = await createProject(pm.id, faker.internet.userName(), description)
    projects.push(project)
  }

  return { pm, projects }
}

export async function createPmProjectAndUsers(numberOfUsers: number) {
  const pm = await createProjectManager()
  const project = await createProject(pm.id)
  const users = []

  for (let i = 0; i < numberOfUsers; i++) {
    const user = await addUserToProject(project.id)
    users.push(user)
  }

  return { pm, project, users }
}

export async function createPmProjectAndTicket(ticketPriority: TicketPriority, ticketType: TicketType) {
  const { pm, project } = await createPmAndProject()
  const ticket = await createTicket(project.id, pm.id, ticketPriority, ticketType)
  return { pm, project, ticket }
}

export async function createPmProjectAndTickets(numberOfTickets: number) {
  const { pm, project } = await createPmAndProject()
  const tickets = await createTickets(numberOfTickets, project.id, pm.id)
  return { pm, project, tickets }
}

export async function createPmProjectUsersAndComments(numberOfUsers: number, numberOfComments: number) {
  const { pm, project } = await createPmAndProject()

  await addUsersToProject(numberOfUsers, project.id)
  await createProjectComments(numberOfComments, project.id, pm.id)

  return { pm, project }
}

export async function createPmProjectTicketAndTickerUsers(numberOfTicketAssignments: number) {
  const { pm, project } = await createPmAndProject()
  const ticket = await createTicket(project.id, pm.id)

  for (let i = 0; i < numberOfTicketAssignments; i++) {
    await assignUserToTicket(project.id, ticket.id)
  }

  return { pm, project, ticket }
}

export async function createPmProjectUsersAndTickets(numberOfUsers: number, numberOfTickets: number) {
  const { pm, project, users } = await createPmProjectAndUsers(numberOfUsers)
  const tickets = await createTickets(numberOfTickets, project.id, pm.id)
  return { pm, project, users, tickets }
}

export async function createPmProjectTicketAndTicketComments(numberOfTicketComments: number) {
  const { pm, project } = await createPmAndProject()
  const ticket = await createTicket(project.id, pm.id)

  const ticketComments = await createTicketComments(numberOfTicketComments, ticket.id, pm.id)

  return { pm, project, ticket, ticketComments }
}