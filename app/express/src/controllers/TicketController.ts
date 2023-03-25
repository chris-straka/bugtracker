import type { Request, Response, NextFunction } from 'express'

export function getAllTicketsForProject (req: Request, res: Response, next: NextFunction): void {}
export function getTicket (): void {}
export function createTicket (): void {}
export function editTicket (): void {}
export function deleteTicket (): void {}
export function assignDeveloperToTicket (): void {}
export function removeDeveloperFromTicket (): void {}

/**
 * Ticket Comments
 */
export function getTicketComments (): void {}
export function editTicketComment (): void {}
export function deleteTicketComment (): void {}
export function createTicketComment (): void {}
