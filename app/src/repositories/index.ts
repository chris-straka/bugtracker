import { pool } from '../config/postgres'
import { redisClient } from '../config/redis'
import { TicketCommentRepository, TicketRepository, TicketUserRepository } from './tickets'
import { ProjectCommentRepository, ProjectRepository, ProjectUserRepository } from './projects'
import { EmailResetRepository } from './reset/email'
import { PasswordResetRepository } from './reset/password'
import { UserRepository } from './user'

export const ticketCommentRepository = new TicketCommentRepository(pool)
export const ticketRepository = new TicketRepository(pool)
export const ticketUserRepository = new TicketUserRepository(pool)

export const projectCommentRepository = new ProjectCommentRepository(pool)
export const projectRepository = new ProjectRepository(pool)
export const projectUserRepository = new ProjectUserRepository(pool)

export const emailResetRepository = new EmailResetRepository(redisClient)
export const passwordResetRepository = new PasswordResetRepository(redisClient)
export const userRepository = new UserRepository(pool)

export * from './tickets'
export * from './projects'
export * from './reset/email'
export * from './reset/password'
export * from './user'
