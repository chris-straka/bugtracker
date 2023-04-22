import type { Request, Response, NextFunction } from 'express'

export function getProjects(req: Request, res: Response, next: NextFunction) {}

export function getProject(req: Request, res: Response, next: NextFunction) {}

export function createProject(req: Request, res: Response, next: NextFunction) {}

export function editProject(req: Request, res: Response, next: NextFunction) {}

export function deleteProject(req: Request, res: Response, next: NextFunction) {}

export function addUserToProject(req: Request, res: Response, next: NextFunction) {}

export function removeUserFromProject(req: Request, res: Response, next: NextFunction) { }

export function getProjectComments(req: Request, res: Response, next: NextFunction) { }

export function createProjectComment(req: Request, res: Response, next: NextFunction) { }

export function editProjectComment(req: Request, res: Response, next: NextFunction) { }

export function deleteProjectComment(req: Request, res: Response, next: NextFunction) { }
