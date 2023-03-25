import type { Request, Response, NextFunction } from 'express'

export function getAllProjects (req: Request, res: Response, next: NextFunction): void {}
export function getProject (): void {}
export function getProjectComments (): void {}
export function createProject (): void {}
export function editProject (): void {}
export function deleteProject (): void {}
export function addUserToProject (): void {}
export function removeUserFromProject (): void {}
