import { faker } from '@faker-js/faker'
import { createTestUser } from '.'
import ProjectCommentRepository from '../../repositories/project/comment'
import ProjectRepository from '../../repositories/project/project'
import ProjectUserRepository from '../../repositories/project/user'
import TicketRepository from '../../repositories/ticket'
import { Roles, TicketPriority, TicketType } from '../../types'

/** 
 * PROJECTS
 */
async function createProject(ownerId: string) {
  const project = await ProjectRepository.createProject(
    faker.company.name(),
    faker.company.bs(),
    ownerId
  )
  return { ...project, id: project.id.toString() }
}

export async function createPmAndProject() {
  const pm = await createTestUser('project_manager')
  const project = await createProject(pm.id)

  return {
    pmId: pm.id,
    pmEmail: pm.email,
    pmUsername: pm.username,
    pm: pm.agent,
    projectId: project.id,
    projectName: project.name,
    projectDescription: project.description
  }
}

export async function createPmAndProjects(numberOfProjects: number) {
  const pm = await createTestUser('project_manager')

  for (let i = 0; i < numberOfProjects; i++) {
    await createProject(pm.id)
  }

  return { pmId: pm.id, pm: pm.agent }
}

export async function createPmProjectAndComment() {
  const { projectId, pmEmail, pm, pmId, pmUsername }  = await createPmAndProject()
  const comment = await createProjectComment(projectId, pmId)
  return { projectId, pmEmail, pm, pmId, pmUsername, comment }
}

/** 
 * PROJECT USERS
 */
export async function createPmAndProjectWithAssignments(numberOfUsers: number) {
  const pm = await createTestUser('project_manager')
  const project = await createProject(pm.id)

  for (let i = 0; i < numberOfUsers; i++) {
    await addUserToProject(project.id)
  }

  return { pmId: pm.id, pm: pm.agent, project, projectId: project.id }
}

export async function addUserToProject(projectId: string, role: Roles = 'developer') {
  const user = await createTestUser(role)
  await ProjectUserRepository.addUserToProject(user.id, projectId)
  return { ...user }
}

export async function addUsersToProject(numberOfUsers: number, projectId: string) {
  for (let i = 0; i < numberOfUsers; i++) {
    await addUserToProject(projectId)
  }
}

/** 
 * PROJECT COMMENTS
 */
export async function createProjectComment(projectId: string, ownerId: string) {
  return await ProjectCommentRepository.createProjectComment(faker.lorem.paragraph(), ownerId, projectId)
}

export async function createProjectComments(numberOfComments: number, projectId: string, ownerId: string) {
  for (let i = 0; i < numberOfComments; i++) {
    await createProjectComment(projectId, ownerId)
  }
}

export async function createPmAndProjectWithUsersAndComments(numberOfUsers: number, numberOfComments: number) {
  const { pm, pmId, pmEmail, projectId } = await createPmAndProject()

  await addUsersToProject(numberOfUsers, projectId)
  await createProjectComments(numberOfComments, projectId, pmId)

  return { pm, pmId, pmEmail, projectId: projectId }
}

/** 
 * TICKETS
 */
export async function createTicket(
  projectId: string, 
  ownerId: string, 
  priority: TicketPriority = 'low',
  type: TicketType = 'bug',
) {
  const name = faker.lorem.sentence()
  const description = faker.lorem.paragraph()
  return await TicketRepository.createTicket(name, description, priority, type, projectId, ownerId)
}

export async function createTickets(
  numberOfTickets: number, 
  projectId: string,
  ownerId: string
) {
  for (let i = 0; i < numberOfTickets; i++) {
    await createTicket(projectId, ownerId)
  }
}

export async function createTicketComment(
  ticketId: string, 
  ownerId: string,
  message: string = faker.random.words(30)
) {
  return await TicketRepository.createTicketComment(ticketId, ownerId, message)
}

export async function createTicketComments(numberOfTicketComments: number, ticketId: string, ownerId: string) {
  for (let i = 0; i < numberOfTicketComments; i++) {
    await createTicketComment(ticketId, ownerId)
  }
}

export async function createTicketAssignment(projectId: string, ticketId: string) {
  const { agent, id: userId } = await addUserToProject(projectId)
  const ticketAssignment = await TicketRepository.createTicketAssignment(ticketId, userId)
  return { agent, userId, ticketAssignmentId: ticketAssignment.id }
}

export async function createPmProjectWithUsersAndTickets(numberOfUsers: number, numberOfTickets: number) {
  const { pm, pmId, projectId } = await createPmAndProjectWithAssignments(numberOfUsers)
  await createTickets(numberOfTickets, projectId, pmId)
  return { pm, pmId, projectId }
}

export async function createPmProjectWithTicketAndTicketComments(numberOfTicketComments: number) {
  const { pm, pmId, projectId } = await createPmAndProject()
  const { id: ticketId } = await createTicket(projectId, pmId)

  await createTicketComments(numberOfTicketComments, ticketId, pmId)

  return { pm, pmId, projectId, ticketId }
}

export async function createPmProjectWithTicketAndTicketAssignments(numberOfTicketAssignments: number) {
  const { pm, pmId, projectId } = await createPmAndProject()
  const { id: ticketId } = await createTicket(projectId, pmId)

  for (let i = 0; i < numberOfTicketAssignments; i++) {
    await createTicketAssignment(projectId, ticketId)
  }

  return { pm, pmId, projectId, ticketId }
}