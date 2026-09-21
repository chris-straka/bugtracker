import type { UserRole } from '../../models/User'
import {
  projectCommentRepository,
  projectRepository,
  projectUserRepository,
  ticketCommentRepository,
  ticketRepository,
  ticketUserRepository,
  userRepository,
} from '../../repositories'
import { closeDbConnections, isPortReachable } from '../helper/db'

afterAll(async () => {
  await closeDbConnections()
})

let counter = 0

async function createDbUser(role: UserRole = 'developer') {
  counter += 1
  const tag = `${Date.now()}_${counter}_${Math.floor(Math.random() * 1e6)}`
  return userRepository.createUser(`cascade_${tag}`, `cascade_${tag}@example.com`, `hash_${tag}`, role)
}

async function reachable(): Promise<boolean> {
  if (await isPortReachable(Number(process.env.PGPORT ?? 5432))) return true
  console.log('skipping transactional repository tests: postgres is not reachable')
  return false
}

describe('transactional repository writes (needs postgres)', () => {
  it('creates a ticket with assignees atomically, then deletes it with its children', async () => {
    if (!(await reachable())) return

    const owner = await createDbUser()
    const assignee = await createDbUser()
    const project = await projectRepository.createProject(
      owner.id.toString(),
      `cascade project ${Date.now()}`,
      'cascade delete proof',
    )
    const ticket = await ticketRepository.createTicketWithAssignees(
      project.id.toString(),
      owner.id.toString(),
      `cascade ticket ${Date.now()}`,
      'created with an assignee in one transaction',
      'low',
      'bug',
      'open',
      [assignee.id.toString()],
    )
    await ticketCommentRepository.createTicketComment(ticket.id.toString(), owner.id.toString(), 'bye')

    expect(
      await ticketUserRepository.checkIfUserIsAssignedToTicket(ticket.id.toString(), assignee.id.toString()),
    ).toBe(true)

    expect(await ticketRepository.deleteTicket(ticket.id.toString())).toBe(true)

    expect(await ticketRepository.ticketExistsById(ticket.id.toString())).toBe(false)
    expect(
      await ticketUserRepository.checkIfUserIsAssignedToTicket(ticket.id.toString(), assignee.id.toString()),
    ).toBe(false)
    expect(await ticketCommentRepository.getTicketComments(ticket.id.toString())).toEqual([])

    expect(await projectRepository.deleteProject(project.id.toString())).toBe(true)
  })

  it('rolls the ticket back when an assignee id is invalid', async () => {
    if (!(await reachable())) return

    const owner = await createDbUser()
    const project = await projectRepository.createProject(
      owner.id.toString(),
      `rollback project ${Date.now()}`,
      'rollback proof',
    )
    const name = `rollback ticket ${Date.now()}`

    await expect(
      ticketRepository.createTicketWithAssignees(
        project.id.toString(),
        owner.id.toString(),
        name,
        'this insert must not survive',
        'low',
        'bug',
        'open',
        ['999999999'],
      ),
    ).rejects.toThrow()
    expect(await ticketRepository.ticketExistsByName(name)).toBe(false)

    expect(await projectRepository.deleteProject(project.id.toString())).toBe(true)
  })

  it('deletes a project together with tickets, comments, and members', async () => {
    if (!(await reachable())) return

    const owner = await createDbUser('project_manager')
    const member = await createDbUser()
    const project = await projectRepository.createProject(
      owner.id.toString(),
      `full cascade ${Date.now()}`,
      'project cascade proof',
    )
    await projectUserRepository.addUserToProject(project.id.toString(), member.id.toString())
    await projectCommentRepository.createProjectComment(project.id.toString(), owner.id.toString(), 'hello')
    const ticket = await ticketRepository.createTicket(
      project.id.toString(),
      owner.id.toString(),
      `nested ${Date.now()}`,
      'nested ticket',
      'low',
      'bug',
      'open',
    )

    expect(await projectRepository.deleteProject(project.id.toString())).toBe(true)

    expect(await projectRepository.projectExistsById(project.id.toString())).toBe(false)
    expect(await ticketRepository.ticketExistsById(ticket.id.toString())).toBe(false)
    expect(await projectCommentRepository.getProjectComments(project.id.toString())).toEqual([])
    expect(
      await projectUserRepository.checkIfUserIsAssignedToProject(project.id.toString(), member.id.toString()),
    ).toBe(false)
  })
})
