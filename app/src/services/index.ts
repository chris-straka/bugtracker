import {
  userRepository,
  projectRepository,
  projectUserRepository,
  ticketRepository,
  emailResetRepository,
  passwordResetRepository,
  projectCommentRepository,
  ticketCommentRepository,
  ticketUserRepository,
  refreshTokenRepository,
} from '../repositories'

import { AdminProjectService, AdminTicketService, AdminUserService } from './admin'
import { EmailService } from './email'
import { ProjectCommentService, ProjectService, ProjectUserService } from './project'
import { EmailResetService, PasswordResetService } from './reset'
import { TicketCommentService, TicketService, TicketUserService } from './ticket'

import { ActivityService } from './activity'
import { AuthService } from './auth'
import { TokenService } from './token'
import { UserService } from './user'

export const adminProjectService = new AdminProjectService(
  userRepository,
  projectRepository,
  projectUserRepository,
)
export const adminTicketService = new AdminTicketService(ticketRepository)
export const adminUserService = new AdminUserService(userRepository)

export const emailService = new EmailService()

export const projectCommentService = new ProjectCommentService(projectCommentRepository)
export const projectService = new ProjectService(projectRepository, userRepository)
export const projectUserService = new ProjectUserService(projectRepository, projectUserRepository)

export const emailResetService = new EmailResetService(emailResetRepository, userRepository)
export const passwordResetService = new PasswordResetService(passwordResetRepository)

export const ticketCommentService = new TicketCommentService(
  projectRepository,
  ticketRepository,
  ticketCommentRepository,
)
export const ticketService = new TicketService(projectRepository, ticketRepository, userRepository)
export const ticketUserService = new TicketUserService(
  projectRepository,
  projectUserRepository,
  ticketRepository,
  ticketUserRepository,
)

export const activityService = new ActivityService(ticketRepository)
export const authService = new AuthService(userRepository)
export const tokenService = new TokenService(userRepository, refreshTokenRepository)
export const userService = new UserService(userRepository, passwordResetRepository)
